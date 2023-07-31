import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetPromotionCodesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform((p) => Number(p.value))
  page?: number = 1;
}
