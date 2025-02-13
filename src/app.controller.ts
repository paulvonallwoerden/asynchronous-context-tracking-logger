import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { withLogCtx } from './log-utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public async getHello(@Req() req: Request): Promise<string> {
    const ctx = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.headers['user-agent'],
    };

    return withLogCtx(ctx, async () => this.appService.getHello());
  }
}
