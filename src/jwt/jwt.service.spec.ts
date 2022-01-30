import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';

const TEST_KEY = 'test_key';
const USER_ID = 1;

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'TOKEN'),
    verify: jest.fn(() => ({ id: USER_ID })),
  };
});

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TEST_KEY },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('Be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Sign', () => {
    it('return a token', async () => {
      const token = service.sign({ id: USER_ID });

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: USER_ID }, TEST_KEY);
      expect(token).toEqual(expect.any(String));
    });
  });

  describe('verify', () => {
    it('Should return the decoded token', async () => {
      const TOKEN = 'TOKEN';

      const decodedToken = service.verify(TOKEN);

      expect(decodedToken).toEqual({ id: USER_ID });

      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY);
    });
  });
});
