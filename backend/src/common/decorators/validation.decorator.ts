import { HttpException, HttpStatus } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }) => {
    if (typeof value === 'string') return value.trim();

    return value;
  });
}

export function TransformDate() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') throw new HttpException('Invalid Date format', HttpStatus.BAD_REQUEST);

    const date = new Date(Number(value));

    if (isNaN(date.getTime())) {
      throw new HttpException('Invalid Date format', HttpStatus.BAD_REQUEST);
    }

    return date;
  });
}
