import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckOutTicketDto {
  eventId: number;
  quantity: number;
  customerEmail: string;
  customerName: string;
  customerCID: string;
  userId?: string;
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
  quantity: number;
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
}
