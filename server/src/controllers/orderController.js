import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items to checkout.'
      });
    }

    // 1. Fetch all products from database using IDs
    const productIds = items.map((i) => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).populate('seller');

    if (dbProducts.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected products could not be found.'
      });
    }

    // Map by ID for quick lookup
    const productMap = new Map();
    dbProducts.forEach((p) => productMap.set(p._id.toString(), p));

    // 2. Multi-Vendor Rule Validation: All items must belong to the exact same seller shop!
    const sellerIds = new Set();
    let targetShop = null;

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct || !dbProduct.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${dbProduct?.name || 'Selected product'}" is no longer available.`
        });
      }

      const shopId = dbProduct.seller._id.toString();
      sellerIds.add(shopId);
      targetShop = dbProduct.seller;

      // 3. Stock availability verification
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}, requested: ${item.quantity}.`
        });
      }
    }

    if (sellerIds.size > 1) {
      return res.status(400).json({
        success: false,
        message:
          'Multi-vendor checkout policy: Orders must be placed with one artisan shop at a time. Please checkout items from each artisan separately.'
      });
    }

    // Check if seller shop is approved
    if (targetShop.approvalStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: `Artisan shop "${targetShop.shopName}" is currently not accepting orders.`
      });
    }

    // 4. Calculate prices authoritatively on server
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      const itemPrice = dbProduct.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: itemPrice,
        quantity: item.quantity,
        image: dbProduct.images[0] || '',
        subtotal: itemSubtotal
      });
    }

    const shippingFee = 500; // Flat LKR 500 standard islandwide delivery
    const total = subtotal + shippingFee;

    // Generate unique human-readable order number, e.g. #ORD0012
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#ORD${randomSuffix}`;

    // 5. Decrement stock atomically
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // 6. Persist order
    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      shop: targetShop._id,
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'simulated' ? 'completed' : 'pending',
      orderStatus: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Order reference: ' + orderNumber,
      order
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('shop', 'shopName logo phone district city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('shop', 'shopName phone district city logo');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Access authorization check: Only the customer who placed the order, the shop owner, or an admin
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    let isSellerOwner = false;

    if (req.user.role === 'seller') {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (shop && order.shop._id.toString() === shop._id.toString()) {
        isSellerOwner = true;
      }
    }

    if (!isCustomer && !isAdmin && !isSellerOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this order.'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Customer cancellation permission check
    const isCustomer = order.customer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only cancel your own orders.'
      });
    }

    // Check allowed transition states
    if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Confirmed') {
      return res.status(400).json({
        success: false,
        message: `Orders with status '${order.orderStatus}' cannot be cancelled automatically. Please contact the artisan shop.`
      });
    }

    // Restore inventory stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancellationReason = reason || 'Cancelled by customer';
    order.cancelledBy = isCustomer ? 'customer' : 'admin';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled and stock restored successfully.',
      order
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found for this seller.'
      });
    }

    const orders = await Order.find({ shop: shop._id })
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateSellerOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, cancellationReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Verify ownership of the shop
    let isAuthorized = req.user.role === 'admin';
    if (!isAuthorized) {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (shop && order.shop.toString() === shop._id.toString()) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update orders for your own artisan shop.'
      });
    }

    // If changing to Cancelled, restore stock if not already cancelled
    if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
      order.cancellationReason = cancellationReason || 'Cancelled by seller';
      order.cancelledBy = req.user.role === 'admin' ? 'admin' : 'seller';
    }

    // If changing from Cancelled back to any active status, reduce stock again if available
    if (order.orderStatus === 'Cancelled' && orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'completed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}.`,
      order
    });
  } catch (error) {
    next(error);
  }
};
