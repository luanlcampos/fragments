// tests/unit/convertFragmentData.test.js

const request = require('supertest');
const app = require('../../src/app');

// write a test that convert a fragment by id
describe('GET /v1/fragments/:id.ext', () => {
  test('should convert fragment', async () => {
    // write a new fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# Fragment from unit test');

    // convert the previously written fragment to html
    const convertRes = await request(app)
      .get(`/v1/fragments/${writeRes.body.fragments.id}.html`)
      .auth('user1@email.com', 'password1');

    expect(convertRes.statusCode).toBe(200);
    expect(convertRes.get('content-type')).toBe('text/html');
    expect(convertRes.text).toBe('<h1>Fragment from unit test</h1>\n');

    // convert the previously written fragment to text
    const convertRes2 = await request(app)
      .get(`/v1/fragments/${writeRes.body.fragments.id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(convertRes2.statusCode).toBe(200);
    expect(convertRes2.get('content-type')).toBe('text/plain');
    expect(convertRes2.text).toBe('# Fragment from unit test');
  });

  test('should convert html to plain text', async () => {
    // write a new html fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('<h1>Fragment from unit test</h1>');

    // convert the previously written fragment to plain text
    const convertRes = await request(app)
      .get(`/v1/fragments/${writeRes.body.fragments.id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(convertRes.statusCode).toBe(200);
    expect(convertRes.get('content-type')).toBe('text/plain');
    expect(convertRes.text).toBe('<h1>Fragment from unit test</h1>');
  });

  test('should convert json to plain text', async () => {
    // write a new json fragment
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send('{"test": "fragment from unit test"}');

    // convert the previously written fragment to plain text
    const convertRes = await request(app)
      .get(`/v1/fragments/${writeRes.body.fragments.id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(convertRes.statusCode).toBe(200);
    expect(convertRes.get('content-type')).toBe('text/plain');
    expect(convertRes.text).toBe('{"test": "fragment from unit test"}');
  });

  test('should convert png to jpeg', async () => {
    // write a new png fragment
    // create a fake png file
    const pngFile = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(pngFile);

    // convert the previously written fragment to jpeg
    const convertRes = await request(app)
      .get(`/v1/fragments/${writeRes.body.fragments.id}.jpeg`)
      .auth('user1@email.com', 'password1');

    expect(convertRes.statusCode).toBe(200);
    expect(convertRes.get('content-type')).toBe('image/jpeg');
  });

  test('should convert jpeg to webp', async () => {
    // write a new png fragment
    // create a fake png file
    const jpegFile = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(jpegFile);

    // convert the previously written fragment to jpeg
    const convertRes = await request(app)
      .get(`/v1/fragments/${writeRes.body.fragments.id}.webp`)
      .auth('user1@email.com', 'password1');

    expect(convertRes.statusCode).toBe(200);
    expect(convertRes.get('content-type')).toBe('image/webp');
  });

  test('should convert webp to gif', async () => {
    // write a new png fragment
    // create a fake png file
    const webpFile = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/webp')
      .send(webpFile);

    // convert the previously written fragment to jpeg
    const convertRes = await request(app)
      .get(`/v1/fragments/${writeRes.body.fragments.id}.gif`)
      .auth('user1@email.com', 'password1');

    expect(convertRes.statusCode).toBe(200);
    expect(convertRes.get('content-type')).toBe('image/gif');
  });

  test('should convert gif to png', async () => {
    // write a new png fragment
    // create a fake png file
    const gifFile = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    const writeRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/gif')
      .send(gifFile);

    // convert the previously written fragment to jpeg
    const convertRes = await request(app)
      .get(`/v1/fragments/${writeRes.body.fragments.id}.png`)
      .auth('user1@email.com', 'password1');

    expect(convertRes.statusCode).toBe(200);
    expect(convertRes.get('content-type')).toBe('image/png');
  });
});
