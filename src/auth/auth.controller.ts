import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from './guard/bearer-token.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  //@Redirect('http://localhost:3000', 302)
  async getUserFromDiscordLogin(@Req() req, @Res() res): Promise<any> {
    //const access_token = req.user;
    //res.cookie('Authorization', `Bearer ${access_token?.access_token}`);
    //res.header('Authorization', `Bearer ${access_token?.access_token}`);
    // res.redirect('http://localhost:3000');
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async googleLoginCallback(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    const userInfo = req.user;

    // res.cookie('Authorization', `Bearer ${access_token?.access_token}`, {
    //   maxAge: 3600000,
    //   domain: 'maplanet.store',
    //   path: '/',
    //   sameSite: 'none', // cross-site에서도 전송
    // });
    console.log(userInfo);
    res
      .cookie('Authorization', `Bearer ${userInfo?.access_token}`, {
        maxAge: this.configService.get<number>('cookieExpires'), // 쿠키의 만료 날짜를 7일 후로 설정
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        // domain: '.maplanet-front.vercel.app',
        domain: '.maplanet.store',
      })
      .cookie(
        'userInfo',
        `${userInfo.payload.global_name},${userInfo.payload.avatar}`,
        {
          maxAge: 3600000,
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          // domain: '.maplanet-front.vercel.app',
          domain: '.maplanet.store',
        },
      )
      .redirect(HttpStatus.MOVED_PERMANENTLY, 'https://www.maplanet.store/');
  }

  @Delete('logout')
  @UseGuards(AccessTokenGuard)
  async DeleteToken(@Req() req, @Res() res) {
    const { discord_id } = req.user;
    await this.authService.deleteRefreshToken(discord_id);
    res
      .clearCookie('Authorization', {
        maxAge: 3600000,
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        // domain: '.maplanet-front.vercel.app',
        domain: '.maplanet.store',
      })
      .clearCookie('userInfo', {
        maxAge: 3600000,
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        // domain: '.maplanet-front.vercel.app',
        domain: '.maplanet.store',
      });
    return '삭제완료';
  }
}
