import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CheckOutTicketDto {
  eventId: number;
  quantity: number;
  customerEmail: string;
  customerName: string;
  customerCID: string;
  userId?: string;
  promoCode?: string;
}

export class BuyTicketDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  customerEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerCID: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  promoCode?: string;
}

export class OrderArgs {
  userId?: string;
  type: string;
  customerEmail: string;
  customerName: string;
  customerCID: string;
  eventId: number;
  price: number;
  quantity: number;
  promoId: number | null;
}
