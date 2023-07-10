import { GeocodingServiceImpl, GeocodingService } from './geocoding.service';

describe('GeocodingService', () => {
  let geocodingService: GeocodingService;

  beforeEach(() => {
    geocodingService = new GeocodingServiceImpl();
  });

  describe('getLocation', () => {
    it('should return location details with language vietnamese', async () => {
      const latitude = 16.0461344;
      const longitude = 108.238544;
      const expectedLocation = {
        city: 'Đà Nẵng',
        country: 'Việt Nam',
        timezone: 'Asia/Ho_Chi_Minh',
      };

      const location = await geocodingService.getLocation(latitude, longitude);

      expect(location).toEqual(expectedLocation);
    });

    it('should return location details with language en', async () => {
      const latitude = 16.0461344;
      const longitude = 108.238544;
      const expectedLocation = {
        city: 'Da Nang',
        country: 'Viet Nam',
        timezone: 'Asia/Ho_Chi_Minh',
      };

      const location = await geocodingService.getLocation(latitude, longitude, 'en');

      expect(location).toEqual(expectedLocation);
    });
  });
});
