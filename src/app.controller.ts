import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Welcome endpoint' })
  getHello(): any {
    return {
      message: 'Welcome to ecommerce-lessslie API',
      status: 'OK',
      documentation: '/api',
    };
  }
}
