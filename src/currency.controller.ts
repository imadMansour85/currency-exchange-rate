import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './currency.service';
import { CreateCurrencyPair } from 'src/createPair.dto';
import { exchangeBodyDto } from './exchangeBody.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from './interfaces/response';
@Controller("/currency")
export class AppController {
  constructor(private readonly appService: AppService) { }


  @Post('pair')
  @ApiOperation({ summary: 'create if not found an CurrencyPair or just update' })
  @UsePipes(ValidationPipe)
  addPair(@Body() CreateCurrencyPair: CreateCurrencyPair): Promise<Response> {
    return this.appService.addPair(CreateCurrencyPair);
  }

  @Get('exchange?')
  @ApiOperation({ summary: 'request exchange rate between two currency with a given amount' })
  convert(@Query() query: exchangeBodyDto): Promise<Response> {
    return this.appService.convert(query);
  }
}