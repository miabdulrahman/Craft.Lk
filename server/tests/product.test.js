import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import './setup.js';

describe('Product Discovery and Management API', () => {
  let customerToken;
  let sellerToken;
  let sampleProductId;

  beforeAll(async () => {
    // Log in as customer
    const custRes = await request(app).post('/api/auth/login').send({
      email: 'customer@craftlk.com',
      password: 'Customer@2026'
    });
    customerToken = custRes.body.token;

    // Log in as approved seller
    const sellRes = await request(app).post('/api/auth/login').send({
      email: 'sunfire@example.com',
      password: 'Sunfire@2026'
    });
    sellerToken = sellRes.body.token;
  });

  it('should retrieve list of products with pagination info', async () => {
    const res = await request(app).get('/api/products?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    sampleProductId = res.body.products[0]._id;
  });

  it('should search products by keyword "Elephant"', async () => {
    const res = await request(app).get('/api/products?search=Elephant');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.products[0].name).toMatch(/Elephant/i);
  });

  it('should filter products by price range', async () => {
    const res = await request(app).get('/api/products?minPrice=2000&maxPrice=3000');
    expect(res.status).toBe(200);
    res.body.products.forEach((prod) => {
      expect(prod.price).toBeGreaterThanOrEqual(2000);
      expect(prod.price).toBeLessThanOrEqual(3000);
    });
  });

  it('should retrieve single product details and related products', async () => {
    const res = await request(app).get(`/api/products/detail/${sampleProductId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product).toHaveProperty('name');
    expect(res.body.product).toHaveProperty('price');
    expect(res.body.product).toHaveProperty('seller');
    expect(Array.isArray(res.body.relatedProducts)).toBe(true);
  });

  it('should prevent regular customer from creating a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Unauthorized Product',
        description: 'Should be rejected',
        price: 1500,
        category: '64a123456789012345678901',
        stock: 5
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
