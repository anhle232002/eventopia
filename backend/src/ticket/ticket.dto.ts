import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProcessTicketDto {
  @ApiProperty()
  @IsBoolean()
  allow: boolean;
}

export class FindTicketDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  cid: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  eventId: number;
}

export class SendETicketDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  cid: string;

  @ApiProperty()
  @IsNumber()
  eventId: number;
}

export class CreateTicketDto {
  type: string;
  eventId: number;
  userId: string;
  price: number;
  customerEmail: string;
  customerName: string;
  customerCID: string;
}
