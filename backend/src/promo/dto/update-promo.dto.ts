import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, Validate } from 'class-validator';
import { IsNotIntersected } from 'src/common/validator/is-intersected.validator';
import { CreatePromoDto } from './create-promo.dto';

export class UpdatePromoDto extends PartialType(OmitType(CreatePromoDto, ['code'])) {
  @ApiProperty({ required: false, type: 'array', items: { type: 'number' } })
  @IsInt({ each: true })
  @Validate(IsNotIntersected, ['events'])
  @IsOptional()
  exclude?: number[];
}
