import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class CreateCurrencyPair {

  @ApiProperty({
    description: 'currency source minimum length 3',
  })
  @IsNotEmpty()
  @MinLength(3)
  from: string;


  @ApiProperty({
    description: 'currency destination minimum length 3',
  })
  @IsNotEmpty()
  @MinLength(3)
  to: string;


  @ApiProperty({
    description: 'exchange rate from-to',
  })
  @IsNotEmpty()
  rate: number;
}