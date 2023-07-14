import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Role } from 'src/common/constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UsersService, private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? `${configService.get<string>('HOST_NAME')}/api/auth/google/redirect`
          : 'http://localhost:3000/api/auth/google/redirect',

      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    Logger.log(profile._json);
    const { email } = profile._json;

    const user = await this.userService.findOneByEmail(email);

    if (user && user.accounts.findIndex((account) => account.providerType === 'google') !== -1) {
      if (Object.getOwnPropertyNames(user).includes('accounts')) {
        delete user.accounts;
      }

      return user;
    }

    let newUser = user as Partial<typeof user>;

    if (!user) {
      newUser = await this.userService.createUser({
        email: profile._json.email,
        role: Role.Individual,
        familyName: profile.name.familyName,
        givenName: profile.name.givenName,
        picture: profile._json.picture,
      });

      Logger.debug(user, 'NEW USER');
    }

    await this.userService.createAccount({
      locale: profile._json.locale,
      providerAccountId: profile.id,
      providerType: 'google',
      userId: newUser.id,
      verified: profile._json.email_verified,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    return newUser;
  }
}
