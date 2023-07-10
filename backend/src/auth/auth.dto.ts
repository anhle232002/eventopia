import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateIf, ValidateNested } from 'class-validator';

export class Organizer {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class LoginWithGoogleDTO {
  email: string;
  id: string;
  givenName: string;
  familyName: string;
  picture: string;
  role: string;
  organizer: { id: string };
}

export class TokenPayload {
  email: string;
  id: string;
  givenName: string;
  familyName: string;
  picture: string;
  role: string;
  iat: string;
  exp: string;
}

export class SignUpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  givenName: string;

  @ApiProperty()
  @IsString()
  familyName: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((object) => {
    if (object.role === 'organizer' && !object.organizer) {
      throw new BadRequestException('Role organizer must come with Organizer info');
    }

    return !!object.role;
  })
  role: string;

  @ApiProperty()
  @ValidateIf((object) => object.role === 'organizer')
  @ValidateNested()
  @Type(() => Organizer)
  organizer: Organizer;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
