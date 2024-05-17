import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { json } from 'stream/consumers';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/v1/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/v1/demo') 
  getDemoProducts() : object {
    return {
      status: "success",
      channels: [
        {
          id: 1,
          name: "pewdiepie"
        },
        {
          id: 2,
          name: "Cocomelon"
        }
      ]
    }
  }
}
