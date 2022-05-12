import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Post } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import * as request from 'supertest';
import { Verification } from 'src/users/entities/verification.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

const GRAQPL_ENDPOINT = '/graphql';

const testUser = {
  email: 'hellox@gmail.com',
  password: '12345',
};

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let userRepository: Repository<User>;
  let verificationsRepository: Repository<Verification>;

  beforeAll(async () => {
    const modules: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modules.createNestApplication();
    userRepository = modules.get<Repository<User>>(getRepositoryToken(User));
    verificationsRepository = modules.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    it('should create account', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .send({
          query: `mutation {
          createAccount(input: {
            email: "${testUser.email}",
            password: "${testUser.password}",
            role: Owner
          }) {
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
  });

  describe('verifyEmail', () => {
    let verificationCode: string;
    beforeAll(async () => {
      const [verification] = await verificationsRepository.find();
      verificationCode = verification.code;
    });

    it('should verify the account', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .send({
          query: `
        mutation {
          verifyEmail(input: {
            code: "${verificationCode}"
          }) {
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          console.log(res.body);

          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;

          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should fail on wrong verify code', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .send({
          query: `
        mutation {
          verifyEmail(input: {
            code: "xxxxx"
          }) {
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          console.log(res.body);

          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;

          expect(ok).toBe(false);
          expect(error).toBe('Verification Not found');
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .send({
          query: `mutation {
            login(input:{
              email: "${testUser.email}"
              password: "${testUser.password}"
            }) {
              ok
              token
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            data: { login },
          } = res.body;

          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken = login.token;
        });
    });

    it('should not login with incorrect credentials', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .send({
          query: `mutation {
            login(input:{
              email: "${testUser.email}"
              password: "xxx"
            }) {
              ok
              token
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            data: { login },
          } = res.body;

          expect(login.ok).toBe(false);
          expect(login.error).toBe('wrong crendentials');
          expect(login.token).toBe(null);
        });
    });
  });

  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await userRepository.find();
      userId = user.id;
    });

    it('should see a user profile', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .set('X-JWT', `${jwtToken}`)
        .send({
          query: `{ 
            userProfile(userId:${userId}) {
            user {
              id
              email
             role
            }
            error
            ok
          } 
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { id },
                },
              },
            },
          } = res;

          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });

    it('should not find user profile', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .set('X-JWT', `${jwtToken}`)
        .send({
          query: `{ 
            userProfile(userId:666) {
            user {
              id
              email
             role
            }
            error
            ok
          } 
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;

          expect(ok).toBe(false);
          expect(error).toBe('User not found');
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should find my profie', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `{ 
              me{
                email
                role
                id
              }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;

          expect(email).toBe(testUser.email);
        });
    });

    it('should not allow loggedout user', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .send({
          query: `{ 
              me{
                email
                role
                id
              }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: { errors },
          } = res;

          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });

  describe('editProfile', () => {
    const NEW_EMAIL = 'vaibhavgupt@protonmail.com';
    it('Should change email', () => {
      return request(app.getHttpServer())
        .post(GRAQPL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `mutation {
          editProfile(input: { email: "${NEW_EMAIL}" }) {
            ok
            error
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          console.log(res.body);
          const {
            body: {
              data: {
                editProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        })
        .then(() => {
          return request(app.getHttpServer())
            .post(GRAQPL_ENDPOINT)
            .set('X-JWT', jwtToken)
            .send({
              query: `{ 
              me{
                email
                role
                id
              }
        }`,
            })
            .expect(200)
            .expect((res) => {
              const {
                body: {
                  data: {
                    me: { email },
                  },
                },
              } = res;

              expect(email).toBe(NEW_EMAIL);
            });
        });
    });
  });
});
