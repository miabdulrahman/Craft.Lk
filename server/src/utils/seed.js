import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { categoriesData } from './seedData.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const seedDatabase = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/craftlk';
  const fallbackUri = 'mongodb://127.0.0.1:27017/craftlk';

  try {
    try {
      await mongoose.connect(primaryUri);
      console.log('[Seed] Connected to primary MongoDB');
    } catch (err) {
      console.warn(`[Seed Warning] Primary MongoDB connection failed (${err.message}). Connecting to local fallback...`);
      await mongoose.connect(fallbackUri);
      console.log('[Seed] Connected to local fallback MongoDB');
    }

    // Clear existing collections
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('[Seed] Cleared old collections');

    // 1. Seed Administrator
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@craftlk.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@CraftLK2026';
    const admin = await User.create({
      name: process.env.ADMIN_DEFAULT_NAME || 'Platform Administrator',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      phone: '0112345678',
      status: 'active'
    });
    console.log(`[Seed] Created Administrator: ${admin.email}`);

    // 2. Seed Customer
    const customer = await User.create({
      name: 'Abdul Rahman',
      email: 'customer@craftlk.com',
      password: 'Customer@2026',
      role: 'customer',
      phone: '0712345678',
      address: {
        street: 'No 123, Main Street',
        city: 'Colombo',
        district: 'Colombo',
        postalCode: '00100'
      },
      status: 'active'
    });
    console.log(`[Seed] Created Customer: ${customer.email}`);

    // 3. Seed Sellers and Shops
    const seller1User = await User.create({
      name: 'Sunfire Crafts',
      email: 'sunfire@example.com',
      password: 'Sunfire@2026',
      role: 'seller',
      phone: '0771234567',
      status: 'active'
    });
    const shop1 = await Shop.create({
      owner: seller1User._id,
      shopName: 'Sunfire Crafts',
      slug: 'sunfire-crafts',
      description:
        'Award-winning heritage artisan studio specializing in traditional hand-carved woodwork, batik wear, and clay pottery.',
      logo: '/images/products/wooden_elephant.jpg',
      banner: '/images/shop_banner.jpg',
      phone: '0771234567',
      district: 'Colombo',
      city: 'Colombo',
      craftCategories: ['Wooden Handicrafts', 'Batik', 'Pottery'],
      approvalStatus: 'approved',
      rating: 4.8,
      reviewCount: 38
    });

    const seller2User = await User.create({
      name: 'Nimal Jayasuriya',
      email: 'kandywood@example.com',
      password: 'Kandy@2026',
      role: 'seller',
      phone: '0782345678',
      status: 'active'
    });
    const shop2 = await Shop.create({
      owner: seller2User._id,
      shopName: 'Kandy Heritage Carvings',
      slug: 'kandy-heritage-carvings',
      description:
        'Third-generation Kandyan woodcarvers producing traditional masks, elephant sculptures, and ornate decorative bowls.',
      logo: '/images/products/wooden_bowl.jpg',
      banner: '/images/shop_banner.jpg',
      phone: '0782345678',
      district: 'Kandy',
      city: 'Pilimathalawa',
      craftCategories: ['Wooden Handicrafts', 'Decorative Items'],
      approvalStatus: 'approved',
      rating: 4.9,
      reviewCount: 22
    });

    const seller3User = await User.create({
      name: 'Anula Weerasinghe',
      email: 'ceylonheritage@example.com',
      password: 'Ceylon@2026',
      role: 'seller',
      phone: '0763456789',
      status: 'active'
    });
    const shop3 = await Shop.create({
      owner: seller3User._id,
      shopName: 'Ceylon Heritage Weaves',
      slug: 'ceylon-heritage-weaves',
      description:
        'Authentic handwoven Dumbara reed crafts, woven shopping totes, and natural cane baskets from rural artisan cooperatives.',
      logo: '/images/products/woven_basket.jpg',
      banner: '/images/shop_banner.jpg',
      phone: '0763456789',
      district: 'Matale',
      city: 'Matale',
      craftCategories: ['Woven Products', 'Gifts'],
      approvalStatus: 'approved',
      rating: 4.7,
      reviewCount: 16
    });

    // Pending application to showcase admin approval workflow
    const seller4User = await User.create({
      name: 'Art & Craft LK',
      email: 'artcraft@example.com',
      password: 'ArtCraft@2026',
      role: 'seller',
      phone: '0754567890',
      status: 'active'
    });
    await Shop.create({
      owner: seller4User._id,
      shopName: 'Art & Craft LK',
      slug: 'art-and-craft-lk',
      description: 'Modern fusion handmade crafts and painted clay ornaments.',
      logo: '/images/products/clay_pot.jpg',
      phone: '0754567890',
      district: 'Matara',
      city: 'Mirissa',
      craftCategories: ['Pottery', 'Gifts'],
      approvalStatus: 'pending'
    });

    // Seller 5
    const seller5User = await User.create({
      name: 'Handmade World',
      email: 'handmadeworld@example.com',
      password: 'Handmade@2026',
      role: 'seller',
      phone: '0715678901',
      status: 'active'
    });
    await Shop.create({
      owner: seller5User._id,
      shopName: 'Handmade World',
      slug: 'handmade-world',
      description: 'Handcrafted silver filigree jewellery and traditional gems.',
      logo: '/images/products/silver_jewellery.jpg',
      phone: '0715678901',
      district: 'Galle',
      city: 'Galle Fort',
      craftCategories: ['Jewellery'],
      approvalStatus: 'approved'
    });

    // Seller 6
    const seller6User = await User.create({
      name: 'Lakshini Crafts',
      email: 'lakshini@example.com',
      password: 'Lakshini@2026',
      role: 'seller',
      phone: '0726789012',
      status: 'active'
    });
    await Shop.create({
      owner: seller6User._id,
      shopName: 'Lakshini Crafts',
      slug: 'lakshini-crafts',
      description: 'Hand-dyed organic batik clothing and accessories.',
      logo: '/images/products/batik_saree.jpg',
      phone: '0726789012',
      district: 'Kurunegala',
      city: 'Kurunegala',
      craftCategories: ['Batik'],
      approvalStatus: 'pending'
    });

    console.log('[Seed] Created 6 sellers and shops');

    // 4. Seed Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Seeded ${categories.length} categories`);

    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // 5. Seed Products
    const productsData = [
      {
        name: 'Batik Saree',
        description:
          'Authentic Sri Lankan hand-dyed royal batik silk saree featuring traditional floral vine motifs, created using beeswax resist dyeing techniques by artisan women.',
        price: 4500,
        currency: 'LKR',
        category: catMap['Batik'],
        seller: shop1._id,
        images: ['/images/products/batik_saree.jpg'],
        stock: 12,
        badges: ['Handmade', 'Eco Friendly', 'Local Seller'],
        rating: 4.8,
        reviewCount: 12,
        isFeatured: true
      },
      {
        name: 'Wooden Elephant',
        description:
          'Beautifully handcrafted wooden elephant made by local artisans in Sri Lanka. Carved from seasoned mahogany wood with exquisite traditional ceremonial carvings. Perfect for home decor or as a thoughtful gift.',
        price: 2800,
        currency: 'LKR',
        category: catMap['Wooden Handicrafts'],
        seller: shop1._id,
        images: ['/images/products/wooden_elephant.jpg'],
        stock: 18,
        badges: ['Handmade', 'Eco Friendly', 'Local Seller'],
        rating: 4.7,
        reviewCount: 8,
        isFeatured: true
      },
      {
        name: 'Handmade Pottery',
        description:
          'Traditional Sri Lankan clay pot thrown on a classic potter wheel and wood-fired in clay kilns. Retains natural moisture and adds authentic rustic flavour to cooking and kitchen decoration.',
        price: 1800,
        currency: 'LKR',
        category: catMap['Pottery'],
        seller: shop1._id,
        images: ['/images/products/clay_pot.jpg'],
        stock: 14,
        badges: ['Handmade', 'Eco Friendly', '100% Natural'],
        rating: 4.6,
        reviewCount: 10,
        isFeatured: true
      },
      {
        name: 'Woven Basket',
        description:
          'Artisanal handwoven cane and palm reed storage basket with matching circular lid. Durable, sustainable, and handcrafted by rural craft cooperatives.',
        price: 2200,
        currency: 'LKR',
        category: catMap['Woven Products'],
        seller: shop3._id,
        images: ['/images/products/woven_basket.jpg'],
        stock: 16,
        badges: ['Handmade', 'Eco Friendly', 'Fair Trade'],
        rating: 4.9,
        reviewCount: 15,
        isFeatured: true
      },
      {
        name: 'Silver Jewellery',
        description:
          'Intricate solid sterling silver filigree choker necklace with genuine Ceylon rainbow moonstone centerpiece. Handcrafted using ancestral Galle silversmithing techniques.',
        price: 5800,
        currency: 'LKR',
        category: catMap['Jewellery'],
        seller: shop1._id,
        images: ['/images/products/silver_jewellery.jpg'],
        stock: 8,
        badges: ['Handmade', 'Sterling Silver', 'Ceylon Gems'],
        rating: 4.8,
        reviewCount: 20,
        isFeatured: true
      },
      {
        name: 'Wooden Bowl',
        description:
          'Smoothly polished mahogany serving bowl hand-carved with traditional Sri Lankan geometric rim engravings. Finished with food-safe organic coconut oil.',
        price: 1800,
        currency: 'LKR',
        category: catMap['Decorative Items'],
        seller: shop2._id,
        images: ['/images/products/wooden_bowl.jpg'],
        stock: 20,
        badges: ['Handmade', 'Eco Friendly', 'Local Seller'],
        rating: 4.5,
        reviewCount: 7,
        isFeatured: true
      },
      {
        name: 'Clay Pot',
        description:
          'Deep terracotta clay earthenware pot with lid for curry preparation and slow cooking. Made from natural red clay found in the Kelani river valley.',
        price: 1900,
        currency: 'LKR',
        category: catMap['Pottery'],
        seller: shop1._id,
        images: ['/images/products/clay_pot.jpg'],
        stock: 9,
        badges: ['Handmade', 'Eco Friendly'],
        rating: 4.6,
        reviewCount: 15,
        isFeatured: false
      },
      {
        name: 'Handloom Table Runner',
        description:
          'Pure woven cotton handloom table runner featuring vibrant geometric motifs inspired by ancient Anuradhapura tapestries.',
        price: 2400,
        currency: 'LKR',
        category: catMap['Batik'],
        seller: shop3._id,
        images: ['/images/products/batik_saree.jpg'],
        stock: 11,
        badges: ['Handmade', '100% Cotton'],
        rating: 4.7,
        reviewCount: 5,
        isFeatured: false
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log(`[Seed] Seeded ${products.length} products`);

    // 6. Seed Orders
    const seededOrders = [
      {
        orderNumber: '#ORD0012',
        customer: customer._id,
        shop: shop1._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: 4500,
            quantity: 1,
            image: products[0].images[0],
            subtotal: 4500
          }
        ],
        subtotal: 4500,
        shippingFee: 500,
        total: 5000,
        shippingAddress: {
          fullName: 'Abdul Rahman',
          phone: '0712345678',
          address: 'No 123, Main Street',
          city: 'Colombo',
          district: 'Colombo'
        },
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'Pending'
      },
      {
        orderNumber: '#ORD0010',
        customer: customer._id,
        shop: shop1._id,
        items: [
          {
            product: products[1]._id,
            name: products[1].name,
            price: 2800,
            quantity: 1,
            image: products[1].images[0],
            subtotal: 2800
          }
        ],
        subtotal: 2800,
        shippingFee: 500,
        total: 3300,
        shippingAddress: {
          fullName: 'Abdul Rahman',
          phone: '0712345678',
          address: 'No 123, Main Street',
          city: 'Colombo',
          district: 'Colombo'
        },
        paymentMethod: 'simulated',
        paymentStatus: 'completed',
        orderStatus: 'Processing'
      },
      {
        orderNumber: '#ORD0008',
        customer: customer._id,
        shop: shop1._id,
        items: [
          {
            product: products[2]._id,
            name: products[2].name,
            price: 1800,
            quantity: 2,
            image: products[2].images[0],
            subtotal: 3600
          }
        ],
        subtotal: 3600,
        shippingFee: 500,
        total: 4100,
        shippingAddress: {
          fullName: 'Abdul Rahman',
          phone: '0712345678',
          address: 'No 123, Main Street',
          city: 'Colombo',
          district: 'Colombo'
        },
        paymentMethod: 'simulated',
        paymentStatus: 'completed',
        orderStatus: 'Shipped'
      },
      {
        orderNumber: '#ORD0001',
        customer: customer._id,
        shop: shop1._id,
        items: [
          {
            product: products[2]._id,
            name: 'Handmade Pottery',
            price: 1800,
            quantity: 1,
            image: products[2].images[0],
            subtotal: 1800
          }
        ],
        subtotal: 1800,
        shippingFee: 500,
        total: 2300,
        shippingAddress: {
          fullName: 'Abdul Rahman',
          phone: '0712345678',
          address: 'No 123, Main Street',
          city: 'Colombo',
          district: 'Colombo'
        },
        paymentMethod: 'cod',
        paymentStatus: 'completed',
        orderStatus: 'Delivered'
      }
    ];

    await Order.insertMany(seededOrders);
    console.log(`[Seed] Seeded ${seededOrders.length} orders`);

    console.log('[Seed] Database successfully seeded with authentic CraftLK data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
