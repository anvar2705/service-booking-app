import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @Public()
    @Post('/registration')
    signUp(@Body() dto: SignUpDto) {
        return this.authService.signUp(dto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    signIn(@Body() dto: SignInDto) {
        return this.authService.signIn(dto);
    }
}
