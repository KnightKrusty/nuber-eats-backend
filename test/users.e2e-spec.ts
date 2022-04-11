import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

const GRAQPL_ENDPOINT = '/graphql';

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modules: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modules.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    it('should create account', () => {
      const EMAIL = 'hellox@gmail.com';
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .send({
          query: `mutation {
          createAccount(input: {
            email: "${EMAIL}",
            password: "12345",
            role: Owner
          }) {
            ok
            error
          }
        }`,
        })
        .expect(200);
    });
  });

  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});
