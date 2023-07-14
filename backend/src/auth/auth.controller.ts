import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { COOKIE_AGE } from 'src/common/constants';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { RequestUser } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto, SignUpDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@ApiTags('Authenticate')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ description: 'Get user data' })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAuth(@ReqUser() user: RequestUser) {
    const preview = await this.userService.getUserPreview(user.id);

    return { user: preview };
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async loginWithEmail(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.createAccessToken(req.user);
    const refreshToken = await this.authService.createRefreshToken(req.user);

    res.cookie('refresh-token', refreshToken, { httpOnly: true, secure: true, maxAge: COOKIE_AGE });

    return { accessToken };
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt-refresh'))
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh-token');
  }

  @ApiOperation({ description: 'Sign up' })
  @Post()
  async signup(@Body() signupDto: SignUpDto) {
    await this.authService.signup(signupDto);

    return { message: 'Sign up successfully' };
  }

  @ApiOperation({ description: 'Authenticate with Google' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async loginWithGoogle() {
    Logger.log('login');
  }

  @ApiExcludeEndpoint(true)
  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, accessToken } = await this.authService.loginWithGoogle(req.user);

    res.cookie('refresh-token', refreshToken, {
      sameSite: 'lax',
      httpOnly: true,
      secure: true,
      maxAge: COOKIE_AGE,
    });

    res.redirect(this.configService.get('CLIENT_URL'));
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Refresh access token' })
  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(@Req() req) {
    Logger.log('refresh token');
    const preview = await this.userService.getUserPreview(req.user.id);

    const accessToken = await this.authService.createAccessToken(preview);

    return { accessToken };
  }
}
