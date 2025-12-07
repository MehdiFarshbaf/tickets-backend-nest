import {Body, Controller, HttpStatus, Post, Req, Res} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Public} from "./decorators/public.decorator";
import {RegisterDto} from "./dto/register.dto";
import type {Response} from "express";
import {LoginDto} from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Public()
    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
        const user = await this.authService.register(registerDto);
        res.status(HttpStatus.CREATED).json({
            success: true,
            message: 'User registered successfully',
            data: user,
        });
    }

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const loginData = await this.authService.login(loginDto);
        res.status(HttpStatus.OK).json({
            success: true,
            message: 'Login successfully',
            data: loginData,
        })
    }
}
