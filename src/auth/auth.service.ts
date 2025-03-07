
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/dtos/auth.dto';
import { CreateUserDto } from 'src/dtos/users.dto';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signInUser(loginData: LoginUserDto) {
    console.log('Datos de login recibidos:', {
      email: loginData.email,
      password: loginData.password
    });
  
    const user = await this.usersRepository.findEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  
    console.log('Usuario encontrado:', {
      email: user.email,
      hashedPassword: user.password // ver el hash almacenado
    });
  
    try {
      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.password
      );
  
      console.log('Comparación de contraseñas:', {
        plainPassword: loginData.password,
        hashedPassword: user.password,
        isValid: isPasswordValid
      });
  
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
  
      const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      };
  
      const token = this.jwtService.sign(payload);
      const { password, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token,
        message: 'Sesión iniciada exitosamente! 🤗'
      };
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
    }
  }

  async signupUser(user: CreateUserDto) {
    const existUser = await this.usersRepository.findEmail(user.email);
    if (existUser) {
      throw new BadRequestException(
        'Ya existe un usuario registrado con este correo electrónico.',
      );
    }
  
    console.log('Password antes de hash:', user.password);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log('Password después de hash:', hashedPassword);
  
    const newUser = { ...user, password: hashedPassword };
    const savedUser = await this.usersRepository.createUser(newUser);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }
}