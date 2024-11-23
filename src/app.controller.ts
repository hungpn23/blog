import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHelloWorld(): object {
    return { message: 'Hello World!' }
  }
}
