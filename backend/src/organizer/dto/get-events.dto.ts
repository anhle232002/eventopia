import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetEventDto {
  @IsOptional()
  @IsNumber()
  @Transform((p) => parseInt(p.value))
  page?: number = 1;

  @IsOptional()
  @IsString()
  @IsIn(['ended', 'upcoming'])
  status: string;
}
