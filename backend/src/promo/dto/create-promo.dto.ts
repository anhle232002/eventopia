import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
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
  @ApiProperty()
  @IsString()
  @MinLength(6)
  code: string;

  @ApiProperty()
  @IsDate()
  @MinDate(add(new Date(), { minutes: 30 }))
  @Transform(({ value }) => new Date(value))
  validFrom: Date;

  @ApiProperty()
  @IsDate()
  @Validate(IsDateBefore, ['validFrom'])
  @Transform(({ value }) => new Date(value))
  validUntil: Date;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty()
  @IsString()
  @IsIn(['fix', 'percentage'])
  type: 'fix' | 'percentage';

  @ApiProperty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  total: number;

  @ApiProperty({ type: 'array', items: { type: 'number' } })
  @IsInt({ each: true })
  events: number[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  applyAll?: boolean;
}
