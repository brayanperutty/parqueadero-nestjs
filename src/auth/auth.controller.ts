import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    
    constructor(private readonly authService: AuthService){};

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: LoginDTO) {
        return await this.authService.signIn(signInDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    register(){
        return 'register';
    }
}
