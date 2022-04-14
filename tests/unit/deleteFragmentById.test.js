// tests/unit/getFragmentById.test.js

const request = require('supertest');
const app = require('../../src/app');

// write a test that delete a fragment by id
describe('DELETE /v1/fragments/:id', () => {
  test('should delete fragment', async () => {
    // write a new fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{"test": "fragment from unit test"}');

    // delete the previously written fragment
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${writeRes.body.fragments.id}`)
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toStrictEqual({ status: 'ok' });
  });

  test('should return 404 if fragment not found', async () => {
    const deleteRes = await request(app)
      .delete('/v1/fragments/wrongId')
      .auth('user1@email.com', 'password1');

    expect(deleteRes.statusCode).toBe(404);
    expect(deleteRes.body).toStrictEqual({
      status: 'error',
      error: { code: 404, message: 'Did not found any fragment with this id' },
    });
  });
});
