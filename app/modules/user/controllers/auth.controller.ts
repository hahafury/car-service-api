import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '@app/modules/user/dto';
import { AuthService } from '@app/modules/user/services/auth.service';
import { Payload } from '@app/modules/user/types';
import { UserEntity, UserTokensEntity } from '@app/modules/user/entities';
import { CookieOptions, Response, Request } from 'express';
import { OnlyAuthorizedGuard } from '@app/modules/user/guards';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthTokenService } from '@app/modules/user/services/auth-token.service';
import { InvalidToken } from '@app/modules/user/exceptions';
import { PasswordNotMatch } from '@app/modules/user/exceptions/password-not-match';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private cookieOptions: CookieOptions = { httpOnly: true };
  constructor(
    private authService: AuthService,
    private authTokenService: AuthTokenService,
  ) {}

  @ApiResponse({
    status: 401,
    description: 'Wrong email or password',
  })
  @ApiResponse({ status: 200, description: 'The user successfully logged in' })
  @ApiBody({
    type: LoginUserDto,
    description: 'Json structure for user object',
  })
  @Post('login')
  async login(
    @Body() loginData: LoginUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const user: UserEntity = await this.authService.login(loginData);

    const payload: Payload = {
      sub: user.id,
      role: user.role.type,
    };

    const [accessToken, refreshToken] =
      await this.authTokenService.getTokens(payload);

    await this.authTokenService.saveTokens(user, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    res.cookie('access_token', accessToken, this.cookieOptions);
    res.cookie('refresh_token', refreshToken, this.cookieOptions);

    res.json({
      message: 'user successfully logged in',
    });
  }

  @ApiResponse({
    status: 400,
    description: 'Password do not match',
  })
  @ApiResponse({
    status: 401,
    description: 'User with this email already exists',
  })
  @ApiResponse({ status: 201, description: 'The user successfully created' })
  @ApiBody({
    type: RegisterUserDto,
    description: 'Json structure for user object',
  })
  @Post('register')
  async register(
    @Body() registerData: RegisterUserDto,
  ): Promise<{ message: string }> {
    if (registerData.password !== registerData.confirmPassword) {
      throw new PasswordNotMatch();
    }

    await this.authService.register(registerData);

    return {
      message: 'user successfully registered',
    };
  }

  @ApiResponse({
    status: 403,
    description: 'Invalid token',
  })
  @ApiResponse({ status: 200, description: 'The user successfully logged out' })
  @Get('logout')
  @UseGuards(OnlyAuthorizedGuard)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken: string | undefined = req.cookies['refresh_token'];
    const payload: Payload =
      await this.authTokenService.verifyRefreshToken(refreshToken);

    const userId: number = payload.sub;

    const tokens: UserTokensEntity | null =
      await this.authTokenService.findTokensByRefreshToken(
        userId,
        refreshToken,
      );

    if (!tokens) {
      throw new InvalidToken();
    }

    await this.authTokenService.removeTokens(tokens);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json({
      message: 'User successfully logged out',
    });
  }

  @ApiResponse({
    status: 403,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
  })
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken: string | undefined = req.cookies['refresh_token'];
    const payload: Payload =
      await this.authTokenService.verifyRefreshToken(refreshToken);

    const userId: number = payload.sub;

    const tokens: UserTokensEntity | null =
      await this.authTokenService.findTokensByRefreshToken(
        userId,
        refreshToken,
      );

    if (!tokens) {
      throw new InvalidToken();
    }

    const newAccessToken: string =
      await this.authTokenService.generateAccessToken({
        sub: userId,
        role: payload.role,
      });

    await this.authTokenService.updateAccessToken(tokens, newAccessToken);

    res.cookie('access_token', newAccessToken, this.cookieOptions);

    res.json({
      message: 'Token successfully refreshed',
    });
  }
}
