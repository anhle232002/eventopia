import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';

describe('Cloudinary service', () => {
  let cloudinary: CloudinaryService;
  let configService = {};
  beforeEach(() => {
    configService = new ConfigService();
  });

  describe('download file', () => {
    it('should output pdf file', async () => {
      const file = await cloudinary.downloadFile('tickets/file_qn1sji', 'test.pdf');

      expect(file).toEqual('test.pdf');
    });
  });
});
