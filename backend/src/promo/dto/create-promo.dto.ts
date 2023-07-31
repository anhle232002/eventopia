import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinDate,
  MinLength,
  Validate,
} from 'class-validator';
import { add } from 'date-fns';
import { IsDateBefore } from 'src/common/validator/is-before.validator';

export class CreatePromoDto {
  @IsString()
  @MinLength(6)
  code: string;

  @IsDate()
  @MinDate(add(new Date(), { minutes: 30 }))
  @Transform(({ value }) => new Date(value))
  validFrom: Date;

  @IsDate()
  @Validate(IsDateBefore, ['validFrom'])
  @Transform(({ value }) => new Date(value))
  validUntil: Date;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsString()
  @IsIn(['fix', 'percentage'])
  type: 'fix' | 'percentage';

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  total: number;

  @IsInt({ each: true })
  events: number[];

  @IsBoolean()
  @IsOptional()
  applyAll?: boolean;
}
