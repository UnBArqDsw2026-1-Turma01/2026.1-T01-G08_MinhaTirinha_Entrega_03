import { Controller, Get, Patch } from '@nestjs/common';

@Controller()
export class AppController {

  @Patch()
  test() {
    return "ok";
  }

}
