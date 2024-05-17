import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { ResponseService } from './responses/response.service';
import { HelloResponse } from './responses/success.response';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOkResponse({
    type: HelloResponse,
    description: 'Hello World!',
  })
  @Get()
  getHello() {
    return this.responseService.successResponse(
      this.appService.getHello(),
      'Hello World!',
    );
  }
}
