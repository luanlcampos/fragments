// tests/unit/getFragmentById.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('should return fragment data', async () => {
    // write a new fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment from unit test');

    // get the previously written fragment
    const fragLocation = writeRes.get('Location');
    const getRes = await request(app)
      .get(fragLocation.substring(fragLocation.indexOf('/')))
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.get('content-type')).toBe('text/plain');
    expect(getRes.text).toBe('fragment from unit test');
  });

  test('should return 404: no frag found', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/randomId')
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(404);
    expect(getRes.body).toStrictEqual({
      status: 'error',
      error: { code: 404, message: 'Did not found any fragment with this id' },
    });
  });

  test('should return 401 unauthorized', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/randomId')
      .auth('wrong@email.com', 'password1');

    expect(getRes.statusCode).toBe(401);
    expect(getRes.body).toStrictEqual({
      status: 'error',
      error: { code: 401, message: 'Unauthorized' },
    });
  });
});
