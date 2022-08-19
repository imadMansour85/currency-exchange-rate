import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCurrencyDto } from 'src/currencies.dto';
@Controller("/api")
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post('create')
  @UsePipes(ValidationPipe)
  createPair(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.appService.createPair(createCurrencyDto);
  }

  @Get('test/:start/:end')
  test(@Param() params) {
    return this.appService.getShortestPath(params.start,params.end);
  }
}
