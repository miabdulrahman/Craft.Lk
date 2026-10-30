import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import './setup.js';

describe('Authentication and Authorization API', () => {
  const uniqueSuffix = Date.now();
  const testEmail = `testuser_${uniqueSuffix}@example.com`;
  const testPassword = 'Password@123';

  it('should register a new customer with valid information', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Customer',
        email: testEmail,
        password: testPassword,
        role: 'customer',
        phone: '0711111111'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('email', testEmail);
    expect(res.body.user).toHaveProperty('role', 'customer');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body).toHaveProperty('token');
  });

  it('should reject registration with duplicate email address', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Customer',
        email: testEmail,
        password: testPassword
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should log in successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword999!'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject access to protected /api/auth/me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
