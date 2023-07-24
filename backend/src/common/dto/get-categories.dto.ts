import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetCategoriesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  q: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  order: string;
}
