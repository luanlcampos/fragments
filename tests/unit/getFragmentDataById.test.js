// tests/unit/getFragmentDataById.test.js

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

  test('should return fragment data converted to html', async () => {
    // write a new fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('### fragment from unit test');

    // get the previously written fragment
    const fragLocation = writeRes.get('Location');
    const getRes = await request(app)
      .get(`${fragLocation.substring(fragLocation.indexOf('/'))}.html`)
      .auth('user1@email.com', 'password1');

    const expectedRes = '<h3>fragment from unit test</h3>';
    expect(getRes.statusCode).toBe(200);
    expect(getRes.get('content-type')).toBe('text/html');
    expect(getRes.text.trimEnd()).toStrictEqual(expectedRes);
  });

  test('should return 415: try to convert to wrong format', async () => {
    // write a new fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('### fragment from unit test');

    // get the previously written fragment
    const fragLocation = writeRes.get('Location');
    const getRes = await request(app)
      .get(`${fragLocation.substring(fragLocation.indexOf('/'))}.jpg`)
      .auth('user1@email.com', 'password1');

    const expectedRes = {
      status: 'error',
      error: {
        code: 415,
        message: 'File conversion not supported',
      },
    };
    expect(getRes.statusCode).toBe(415);
    expect(getRes.body).toStrictEqual(expectedRes);
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
