import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTO/register.dto';
import { LoginDto } from './DTO/login.dtp'; 
import { ConfirmEmailDto } from './DTO/confirmEmail.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('register')
    async register(@Body() body : RegisterDto){
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body : LoginDto){
        return this.authService.login(body);
    }

    @Patch('confirm-email')
    async confirmEmail(@Body() body : ConfirmEmailDto){
        return this.authService.confirmEmail(body);
    }
}

