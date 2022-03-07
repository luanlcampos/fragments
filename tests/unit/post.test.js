// tests/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('should write and read a new fragment ', async () => {
    // write a new fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment from unit test');

    // expects successful write response
    // header test
    expect(writeRes.statusCode).toBe(201);
    expect(writeRes.get('Location')).not.toBeNull();
    expect(writeRes.get('content-length')).toBe('183');
    // body test
    expect(writeRes.body).toHaveProperty('status', 'ok');
    expect(writeRes.body).toHaveProperty('fragments');
    expect(new Date(writeRes.body.fragments.created)).toBeInstanceOf(Date);
    expect(new Date(writeRes.body.fragments.updated)).toBeInstanceOf(Date);
    expect(writeRes.body.fragments.type).toBe('text/plain');
    expect(writeRes.body.fragments.id).not.toBeNull();
    expect(writeRes.body.fragments.ownerId).not.toBeNull();
  });

  test('should return 415: wrong file format', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send('fragment from unit test');

    expect(res.statusCode).toBe(415);
    expect(res.body).toStrictEqual({
      status: 'error',
      error: { code: 415, message: 'File format is not supported' },
    });
  });

  test('should return 401: unauthorized', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send('fragment from unit test');

    expect(res.statusCode).toBe(401);
    expect(res.body).toStrictEqual({
      status: 'error',
      error: { code: 401, message: 'Unauthorized' },
    });
  });
});
