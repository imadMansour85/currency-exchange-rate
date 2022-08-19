import { IsNotEmpty, MinLength } from "class-validator";

export class CreateCurrencyDto {
  @IsNotEmpty()
  @MinLength(3)
  from: string;

  @IsNotEmpty()
  @MinLength(3)
  to: string;

  @IsNotEmpty()
  rate: number;
}