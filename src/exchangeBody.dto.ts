import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class exchangeBodyDto {
  @ApiProperty({
    description: 'currency want to convert from... minimum length 3',
  })
  @IsNotEmpty()
  @MinLength(3)
  from: string;

  @ApiProperty({
    description: 'currency want to convert to minimum length 3',
  })
  @IsNotEmpty()
  @MinLength(3)
  to: string;

  @ApiProperty({
    description: 'amount',
  })
  @IsNotEmpty()
  amount: number;
}