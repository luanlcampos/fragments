// tests/unit/updateFragmentById.test.js

const request = require('supertest');
const app = require('../../src/app');

// write a test that update a fragment by id
describe('PUT /v1/fragments/:id', () => {
  test('should update fragment', async () => {
    // write a new fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{"test": "fragment from unit test"}');

    // update the previously written fragment
    const updateRes = await request(app)
      .put(`/v1/fragments/${writeRes.body.fragments.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{"test": "updated fragment from unit test"}');

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.get('content-type')).toBe('application/json; charset=utf-8');
    expect(updateRes.body).toHaveProperty('status', 'ok');
    expect(updateRes.body).toHaveProperty('fragments');
    expect(new Date(updateRes.body.fragments.created)).toBeInstanceOf(Date);
    expect(new Date(updateRes.body.fragments.updated)).toBeInstanceOf(Date);
    expect(updateRes.body.fragments.id).not.toBeNull();
    expect(updateRes.body.fragments.ownerId).not.toBeNull();

    // get the previously updated fragment
    const fragLocation = updateRes.get('Location');
    const getRes = await request(app)
      .get(fragLocation.substring(fragLocation.indexOf('/')))
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.get('content-type')).toBe('application/json');
    expect(getRes.text).toBe('{"test": "updated fragment from unit test"}');

    // try to update a fragment with a different type
    const updateRes2 = await request(app)
      .put(`/v1/fragments/${writeRes.body.fragments.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('updated fragment from unit test');

    expect(updateRes2.statusCode).toBe(400);
    expect(updateRes2.body).toStrictEqual({
      status: 'error',
      error: { code: 400, message: 'Bad Request' },
    });
  });

  test('Should return 404: fragment not found', async () => {
    const updateRes = await request(app)
      .put('/v1/fragments/wrongId')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{"test": "updated fragment from unit test"}');

    expect(updateRes.statusCode).toBe(400);
    expect(updateRes.body).toStrictEqual({
      status: 'error',
      error: { code: 400, message: 'No fragment with this id found for this user' },
    });
  });

  test('Should return 401: Forbidden', async () => {
    // write a new fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{"test": "fragment from unit test"}');

    // update the previously written fragment with wrong credentials
    const updateRes = await request(app)
      .put(`/v1/fragments/${writeRes.body.fragments.id}`)
      .auth('wronguser@email.com', 'wrongpassword')
      .set('Content-Type', 'application/json')
      .send('{"test": "updated fragment from unit test"}');

    expect(updateRes.statusCode).toBe(401);
    expect(updateRes.body).toStrictEqual({
      status: 'error',
      error: { code: 401, message: 'Unauthorized' },
    });
  });
});
