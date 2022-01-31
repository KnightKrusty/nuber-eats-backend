import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';
import FormData from 'form-data';
import got from 'got';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

jest.mock('got');
jest.mock('form-data');

const TEST_DOMAIN = 'test-domain';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-apikey',
            domain: TEST_DOMAIN,
            fromEmail: 'test-email',
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send verification email', () => {
    it('should call sendEmail', () => {
      const sendVerificationEmailArg = {
        email: 'email',
        code: 'code',
      };

      jest
        .spyOn(service, 'sendEmail')
        .mockImplementation(async () => Promise.resolve(true));

      service.sendVerificationEmail(
        sendVerificationEmailArg.email,
        sendVerificationEmailArg.code,
      );

      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'Verify Your email',
        'verify-email',
        'email',
        [
          { key: 'code', value: sendVerificationEmailArg.code },
          { key: 'username', value: sendVerificationEmailArg.email },
        ],
      );
    });
  });

  describe('sendEmail', () => {
    it('send email', async () => {
      const result = await service.sendEmail('', '', '', [
        { key: 'code', value: 'code' },
        { key: 'username', value: 'hello@dummy.com' },
      ]);

      const formSpy = jest.spyOn(FormData.prototype, 'append');
      expect(formSpy).toHaveBeenCalledTimes(6);

      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );

      expect(result).toEqual(true);
    });

    it('fails on error', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });

      const result = await service.sendEmail('', '', '', [
        { key: 'code', value: 'code' },
        { key: 'username', value: 'hello@dummy.com' },
      ]);

      expect(result).toEqual(false);
    });
  });
});
