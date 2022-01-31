import got from 'got';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(
    subject: string,
    template: string,
    to: string,
    emailVars: EmailVar[],
  ): Promise<boolean> {
    const form = new FormData();
    form.append('from', `Niko Nuber Eats <mailgun@${this.options.domain}> `);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));

    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerificationEmail(email: string, Verifiacitoncode: string) {
    this.sendEmail('Verify Your email', 'verify-email', email, [
      { key: 'code', value: Verifiacitoncode },
      { key: 'username', value: email },
    ]);
  }
}
