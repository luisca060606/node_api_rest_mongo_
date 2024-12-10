const request = require('supertest');
const app = require('../src/app');
const { connect, getUri, closeDb } = require('../dbtest');
const { Builder } = require('../builders/author.builder');

beforeAll(async () => {
  const uri = await getUri();
  await connect({ uri });
});

afterAll(async () => {
  await closeDb();
});

describe('POST /authors', () => {
  test('should store a new author', async () => {
    const author = Builder.author();
    const response = await request(app)
      .post('/authors')
      .send(author)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    const { ...authorStored } = response.body;
    expect(authorStored.name).toEqual(author.name);
    expect(authorStored.user_register).toEqual(author.user_register);
  });
});
