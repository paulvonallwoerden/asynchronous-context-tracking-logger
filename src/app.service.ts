import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { setTimeout } from 'timers/promises';
import { withLogCtx } from './log-utils';

@Injectable()
export class AppService {
  public constructor(private readonly logger: Logger) {}

  async getHello(): Promise<string> {
    this.logger.log('Someone requested greetings :-)');

    const lang = 'de-DE';

    const [hello, num] = await Promise.all([
      withLogCtx({ task: 'hello' }, () => this.fetchTranslatedHello(lang)),
      withLogCtx({ task: 'number' }, () => this.calculateNiceNumber()),
    ]);

    return `${hello} (${num})`;
  }

  private async calculateNiceNumber() {
    this.logger.log('COMPUTING NUMBER...');
    await setTimeout(Math.random() * 2_000);

    this.logger.log('FOUND THE BEST NUMBER');
    return (Math.random() * 100).toFixed(0);
  }

  private async fetchTranslatedHello(lang: string): Promise<string> {
    this.logger.log('Fetching cool greeting from db...', { lang });

    let hello: string;
    switch (lang) {
      case 'de-DE':
        hello = await setTimeout(2_000, 'Guten Tag 🇩🇪');
        break;
      case 'en-GB':
        hello = await setTimeout(1_000, 'Hi there 🇬🇧');
        break;
      default:
        hello = await setTimeout(0, 'Bonjour 🏳️‍🌈');
        break;
    }

    this.logger.log(`We will answer with ${hello}`);

    return hello;
  }
}
