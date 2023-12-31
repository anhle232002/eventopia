import { BadRequestException, HttpException, Optional } from '@nestjs/common';
import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { Event, Prisma, User } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  Equals,
  isArray,
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsJSON,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  isNumber,
  IsNumber,
  isNumberString,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { TransformDate, Trim } from 'src/common/decorators/validation.decorator';

export class GetEventsQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    value = parseInt(value);

    if (value !== 1) throw new BadRequestException('online must be value 1');
    return value;
  })
  @ApiProperty({ required: false, description: 'Get online events. Value equal 0 or 1' })
  @IsNumber()
  online?: number;

  @ApiProperty({ required: false, description: 'Currently not supported' })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({ required: false, description: 'Organizer Id' })
  @IsOptional()
  @IsString()
  organizer?: string;

  @ApiProperty({ required: false, description: 'Latitude' })
  @IsOptional()
  @IsLatitude()
  @Transform(({ value }) => Number(value))
  lat?: number;

  @ApiProperty({ required: false, description: 'Longtitude' })
  @IsOptional()
  @IsLongitude()
  @Transform(({ value }) => Number(value))
  long?: number;

  @ApiProperty({ required: false, description: 'Category id', type: 'array', items: { type: 'int' } })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  @IsInt({
    each: true,
  })
  @Transform((p) => {
    if (isArray(p.value)) return p.value.map(Number);
    if (isNumberString(p.value.trim())) return [Number(p.value)];
  })
  category?: number[];

  @ApiProperty({ required: false, description: 'get events by followed organizers' })
  @IsOptional()
  @Equals(1)
  @Transform((p) => Number(p.value))
  fo: number;
}

export class CreateEventDto {
  organizerId: string;

  @ApiProperty()
  @Trim()
  @IsString()
  title: string;

  @ApiProperty()
  @Trim()
  @IsString()
  shortDescription: string;

  @ApiProperty()
  @Trim()
  @IsString()
  description: string;

  @ApiProperty()
  @Trim()
  @IsString()
  @ValidateIf((object) => !object.isOnlineEvent)
  location: string;

  @ApiProperty({ description: 'Datetime string, example: "1688962912000"' })
  @IsDate()
  @TransformDate()
  @Transform(({ value }) => {
    if ((<Date>value).getTime() < Date.now()) {
      throw new HttpException('Start date must be after present atleast 15 minutes', 400);
    }
    return value;
  })
  startDate: Date;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  totalTickets: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  ticketPrice: number;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value >= 1) return true;
    else return false;
  })
  isOnlineEvent: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  onlineUrl: string;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  duration: string;

  images?: ImageUrl[];

  @ApiProperty({ type: 'string', format: 'binary' })
  imageFiles: Express.Multer.File[];

  @ApiProperty({
    description:
      'Event Agenda in JSON string, Ex: [{"startTime": "6:00 PM","endTime": "7:00 PM","title": "Welcome meeting"}]',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsObject({ each: true })
  @Transform((p) => {
    try {
      console.log(JSON.parse(p.value));

      return JSON.parse(p.value);
    } catch (error) {
      throw new BadRequestException('Agenda field must be a valid JSON string');
    }
  })
  agenda: Prisma.JsonArray;
}

export interface EventIncludesOrganizer extends Partial<Event> {
  organizer: Omit<Partial<User>, 'password'>;
}

export interface ImageUrl {
  publicId: string;
  url: string;
}

export class UpdateEventDto extends PartialType(OmitType(CreateEventDto, ['organizerId', 'imageFiles'])) {
  @ApiProperty({ required: false, description: 'The public IDs of the images should be removed' })
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new HttpException('Invalid JSON format at imageUrl field', 400);
    }
  })
  @IsArray()
  @IsOptional()
  removedImages?: string[];
}

export interface EmailReceiver {
  customerEmail: string;
  customerName: string;
}
