import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @Public()
    @Post('/sign-up')
    signUp(@Body() dto: SignUpDto) {
        return this.authService.signUp(dto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('/sign-in')
    signIn(@Body() dto: SignInDto) {
        return this.authService.signIn(dto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('/refresh-tokens')
    refreshTokens(@Body() dto: RefreshTokenDto) {
        return this.authService.resreshTokens(dto);
    }
}
