import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/constants';
import { OrganizerService } from 'src/organizer/organizer.service';
import { UsersService } from 'src/users/users.service';
import { LoginWithGoogleDTO, SignUpDto } from './auth.dto';
import bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly organizerService: OrganizerService,
  ) {}

  async signup(signupDto: SignUpDto) {
    const user = await this.usersService.findOneByEmail(signupDto.email);

    if (user) {
      throw new BadRequestException('User with this email is already exist');
    }

    const newUser = await this.usersService.createUser({
      email: signupDto.email,
      familyName: signupDto.familyName,
      role: Role.Individual,
      givenName: signupDto.givenName,
      password: signupDto.password,
    });

    await this.usersService.createAccount({
      userId: newUser.id,
      providerType: 'local',
      providerAccountId: null,
      verified: false,
      locale: '',
    });

    if (signupDto.isOrganizer && signupDto.organizer) {
      await this.organizerService.create({
        description: signupDto.organizer.description,
        email: signupDto.organizer.email,
        name: signupDto.organizer.name,
        phoneNumber: signupDto.organizer.phoneNumber,
        userId: newUser.id,
      });
    }

    return newUser;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email, true);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (!user.password) {
      throw new BadRequestException('User is not registered by this password');
    }

    const passwordMatched = await bcrypt.compare(pass, user.password);

    if (passwordMatched) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async loginWithGoogle(user: LoginWithGoogleDTO) {
    try {
      if (!user) throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      const payload = {
        email: user.email,
        familyName: user.familyName,
        givenName: user.givenName,
        id: user.id,
        picture: user.picture,
        role: user.role,
        organizer: user.organizer,
      };
      Logger.log(payload, 'payload');
      const [accessToken, refreshToken] = await Promise.all([
        this.createAccessToken(payload),
        this.createRefreshToken(payload),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  createAccessToken(payload: any) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_AGE'),
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }
  createRefreshToken(payload: any) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_AGE'),
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  verifyToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }
}
