import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Product from '../src/models/Product.js';
import Shop from '../src/models/Shop.js';
import './setup.js';

describe('Order Processing and Multi-Vendor Rules API', () => {
  let customerToken;
  let otherCustomerToken;
  let shop1Products;
  let shop2Products;
  let createdOrderId;

  beforeAll(async () => {
    // Login Customer 1
    const cust1 = await request(app).post('/api/auth/login').send({
      email: 'customer@craftlk.com',
      password: 'Customer@2026'
    });
    customerToken = cust1.body.token;

    // Register Customer 2
    const cust2 = await request(app).post('/api/auth/register').send({
      name: 'Second Customer',
      email: `cust2_${Date.now()}@craftlk.com`,
      password: 'Customer2@2026'
    });
    otherCustomerToken = cust2.body.token;

    // Fetch products belonging to different shops
    const shop1 = await Shop.findOne({ shopName: 'Sunfire Crafts' });
    const shop2 = await Shop.findOne({ shopName: 'Kandy Heritage Carvings' });

    shop1Products = await Product.find({ seller: shop1._id });
    shop2Products = await Product.find({ seller: shop2._id });
  });

  it('should enforce one-seller-per-checkout and reject multi-vendor mixed carts', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [
          { productId: shop1Products[0]._id.toString(), quantity: 1 },
          { productId: shop2Products[0]._id.toString(), quantity: 1 }
        ],
        shippingAddress: {
          fullName: 'Abdul Rahman',
          phone: '0712345678',
          address: '123 Main St',
          city: 'Colombo',
          district: 'Colombo'
        },
        paymentMethod: 'simulated'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/one artisan shop at a time/i);
  });

  it('should reject order if requested quantity exceeds available stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [{ productId: shop1Products[0]._id.toString(), quantity: 9999 }],
        shippingAddress: {
          fullName: 'Abdul Rahman',
          phone: '0712345678',
          address: '123 Main St',
          city: 'Colombo',
          district: 'Colombo'
        },
        paymentMethod: 'cod'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/insufficient stock/i);
  });

  it('should successfully place valid order, calculate authoritative total, and decrement stock', async () => {
    const targetProduct = shop1Products[0];
    const initialStock = targetProduct.stock;
    const orderQuantity = 2;

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [{ productId: targetProduct._id.toString(), quantity: orderQuantity }],
        shippingAddress: {
          fullName: 'Abdul Rahman',
          phone: '0712345678',
          address: 'No 123 Main Street',
          city: 'Colombo',
          district: 'Colombo'
        },
        paymentMethod: 'simulated'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order).toHaveProperty('orderNumber');
    expect(res.body.order.subtotal).toBe(targetProduct.price * orderQuantity);
    expect(res.body.order.shippingFee).toBe(500);
    expect(res.body.order.total).toBe(targetProduct.price * orderQuantity + 500);
    expect(res.body.order.paymentStatus).toBe('completed');
    createdOrderId = res.body.order._id;

    // Verify stock decremented in database
    const updatedProduct = await Product.findById(targetProduct._id);
    expect(updatedProduct.stock).toBe(initialStock - orderQuantity);
  });

  it('should prevent another customer from viewing this order', async () => {
    const res = await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${otherCustomerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow customer to cancel order and restore stock', async () => {
    const targetProduct = shop1Products[0];
    const productBeforeCancel = await Product.findById(targetProduct._id);
    const stockBeforeCancel = productBeforeCancel.stock;

    const res = await request(app)
      .patch(`/api/orders/${createdOrderId}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ reason: 'Changed mind' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.order.orderStatus).toBe('Cancelled');

    // Verify stock restored
    const productAfterCancel = await Product.findById(targetProduct._id);
    expect(productAfterCancel.stock).toBe(stockBeforeCancel + 2);
  });
});
