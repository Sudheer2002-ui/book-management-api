const request = require('supertest');
const app = require('../app');

describe('Book API Endpoints', () => {
  let createdId = '';

  it('should create a new book', async () => {
    const res = await request(app)
      .post('/books')
      .send({
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2021,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch the newly created book', async () => {
    const res = await request(app).get(`/books/${createdId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Test Book');
  });

  it('should update the book', async () => {
    const res = await request(app)
      .put(`/books/${createdId}`)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Updated Title');
  });

  it('should delete the book', async () => {
    const res = await request(app).delete(`/books/${createdId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', createdId);
  });

  it('should return 404 for deleted book', async () => {
    const res = await request(app).get(`/books/${createdId}`);
    expect(res.statusCode).toEqual(404);
  });
});
