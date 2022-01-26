// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('/ app test', () => {
  test('should return 404 not found', async () => {
    const res = await request(app).get('/fragments/filter');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
