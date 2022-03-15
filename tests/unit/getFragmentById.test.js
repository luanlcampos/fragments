// tests/unit/getFragmentById.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('should return fragment data', async () => {
    // write a new fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{"test": "fragment from unit test"}');

    // get the previously written fragment
    const fragLocation = writeRes.get('Location');
    const getRes = await request(app)
      .get(fragLocation.substring(fragLocation.indexOf('/')))
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.get('content-type')).toBe('application/json');
    expect(writeRes.body).toHaveProperty('status', 'ok');
    expect(writeRes.body).toHaveProperty('fragments');
    expect(new Date(writeRes.body.fragments.created)).toBeInstanceOf(Date);
    expect(new Date(writeRes.body.fragments.updated)).toBeInstanceOf(Date);
    expect(writeRes.body.fragments.id).not.toBeNull();
    expect(writeRes.body.fragments.ownerId).not.toBeNull();
    expect(getRes.text).toBe('{"test": "fragment from unit test"}');
  });

  test('Should return 404: fragment not found', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/wrongId/info')
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(404);
    expect(getRes.body).toStrictEqual({
      status: 'error',
      error: { code: 404, message: 'Did not found any fragment with this id' },
    });
  });
});
