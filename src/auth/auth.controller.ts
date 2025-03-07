import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, SignupUserDto } from '../dtos/auth.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('signup')
  async signupUser(@Body() signupDto: SignupUserDto) {
    try {
      if (signupDto.password !== signupDto.passwordConfirm) {
        throw new HttpException(
          'Las contraseñas no coinciden',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.authService.signupUser(signupDto);
    } catch (error) {
      if (error?.code === '23505') {
        throw new HttpException(
          'El email ya está registrado',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        error.message || 'Error al crear el usuario',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

 
  @Post('signin')
  async signIn(@Body() loginUserDto: LoginUserDto) {
    try {
      return await this.authService.signInUser(loginUserDto);
    } catch (error) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
  }
  }}
