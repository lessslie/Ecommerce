// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/users.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockFullUser: Partial<User> = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    password: '',  // Se llenará con el hash
    phone: 123456789,
    country: 'Test Country',
    address: 'Test Address',
    city: 'Test City',
    isAdmin: false,
    orders: []
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      findEmail: jest.fn(),
      createUser: jest.fn()
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('test-token')
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  it('debe ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('signInUser', () => {
    it('debería lanzar una excepción no autorizada cuando no se encuentre el usuario', async () => {
      const loginDto = { email: 'test@test.com', password: 'Test123!' };
      usersRepository.findEmail.mockResolvedValue(null);

      await expect(service.signInUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar una excepción no autorizada cuando la contraseña no sea válida', async () => {
      const loginDto = { email: 'test@test.com', password: 'wrong-password' };
      const mockUser = {
        ...mockFullUser,
        password: await bcrypt.hash('Test123!', 10)
      };
      usersRepository.findEmail.mockResolvedValue(mockUser as User);

      await expect(service.signInUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('debería devolver los datos del usuario y el token cuando el inicio de sesión sea exitoso', async () => {
      const loginDto = { email: 'test@test.com', password: 'Test123!' };
      const mockUser = {
        ...mockFullUser,
        password: await bcrypt.hash('Test123!', 10)
      };
      
      usersRepository.findEmail.mockResolvedValue(mockUser as User);

      const result = await service.signInUser(loginDto);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('message', 'Sesión iniciada exitosamente! 🤗');
      expect(result.user).not.toHaveProperty('password');
    });
  });


describe('signupUser', () => {
    it('debería lanzar BadRequestException cuando el usuario ya existe', async () => {
      const signupDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'Test123!',
        phone: 123456789,
        address: 'Test Address',
        country: 'Test Country',
        city: 'Test City'
      };

      usersRepository.findEmail.mockResolvedValue(mockFullUser as User);

      await expect(service.signupUser(signupDto)).rejects.toThrow(BadRequestException);
    });

    it('debería crear usuario exitosamente', async () => {
      const signupDto = {
        name: 'Test User',
        email: 'new@test.com',
        password: 'Test123!',
        phone: 123456789,
        address: 'Test Address',
        country: 'Test Country',
        city: 'Test City'
      };

      usersRepository.findEmail.mockResolvedValue(null);
      usersRepository.createUser.mockResolvedValue({
        ...signupDto,
        id: '1',
        isAdmin: false,
        password: await bcrypt.hash(signupDto.password, 10)
      } as User);

      const result = await service.signupUser(signupDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email', signupDto.email);
    });
  });

});