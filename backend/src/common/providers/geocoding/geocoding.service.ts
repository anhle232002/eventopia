import { Injectable } from '@nestjs/common';

export interface GeocodingService {
  getLocation(
    latitude: number,
    longtitude: number,
    language?: string,
  ): Promise<{ city: string; country: string; timezone: string }>;
}

@Injectable()
export class GeocodingServiceImpl implements GeocodingService {
  async getLocation(
    latitude: number,
    longtitude: number,
    language = 'en',
  ): Promise<{ city: string; country: string; timezone: string }> {
    const response = await fetch(
      'https://api.bigdatacloud.net/data/reverse-geocode-client' +
        `?latitude=${latitude}&longitude=${longtitude}&localityLanguage=${language}`,
    );

    const data = await response.json();
    console.log(data);

    const timezone =
      (data.localityInfo.informative as any[]).find((info) => info.description === 'time zone').name || null;

    return { city: data.city, country: data.countryName, timezone: timezone };
  }
}
