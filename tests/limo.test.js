const supertest = require('supertest');
const app = require('../app');
const { describe } = require('node:test');

let token;

describe('shorten Limo', () => {
  it('sign up', async () => {
    const user = {
      username: 'John Doe',
      email: 'john@yahoo.com',
      password: '1234xyz',
      password2: '1234xyz',
    };

    const res = await supertest(app).post('/signup').send(user);
    expect(res.status).toBe(200);
  });

  it('Log in', async () => {
    const userInfo = {
      email: 'john@yahoo.com',
      password: '1234xyz',
    };
    const res = await supertest(app).post('/login').send(userInfo);
    const setCookieHeader = res.headers['set-cookie'];
    const jwtCookie = setCookieHeader.find((cookie) =>
      cookie.startsWith('jwt=')
    );

    if (jwtCookie) {
      token = jwtCookie.split('=')[1].split(';')[0];
      // Use the token as needed
      console.log(token);

      expect(res.status).toBe(200);
      expect(token).toBeDefined();
    } else {
      // JWT cookie not found
      console.log(`JWT NOT Found.`);
    }
  });

  it('should return shortened link', async () => {
    const url = 'https://create-react-app.dev/?ref=jonas.io';

    const res = await supertest(app)
      .post('/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send(url);

    expect(res.status).toBe(200);
  });
});
