// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from '../entities/users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUser: Partial<User> = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    password: 'hashedPassword',
    phone: 123456789,
    country: 'Test Country',
    address: 'Test Address',
    city: 'Test City',
    isAdmin: false,
    orders: []  // Agregamos la propiedad orders
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      getUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  describe('getUsersService', () => {
    it('debería devolver todos los usuarios', async () => {
      repository.getUsers.mockResolvedValue([mockUser as User]);
      
      const result = await service.getUsersService();
      
      expect(result).toHaveLength(1);
      expect(repository.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('debería devolver el usuario por id', async () => {
      repository.getUserById.mockResolvedValue(mockUser as User);
      
      const result = await service.getUserById('1');
      
      expect(result).toEqual(mockUser);
      expect(repository.getUserById).toHaveBeenCalledWith('1');
    });
  });
 
  describe('deleteUser', () => {
    it('Debería eliminar al usuario por id con éxito', async () => {
      const userId = '1';
      repository.deleteUser.mockResolvedValue(userId);

      const result = await service.deleteUser(userId);

      expect(repository.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toBe(userId);
    });
  });
});