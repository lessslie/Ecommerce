
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/users.dto';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {


  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();

    const userWithoutPass = users.map((user) => {
      const { password, ...cleanUser } = user;

      return cleanUser;
    });
    return userWithoutPass;
  }

  async getUserById(id: string): Promise<Partial<User>> {
    const foundUser = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!foundUser) throw new Error(`El usuario de id ${id} no fue encontrado`);

    const { password,isAdmin ,...cleanUser } = foundUser;
    return cleanUser;
  }
  async createUser(user: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async updateUser(id: string, user: CreateUserDto): Promise<string> {
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOneBy({ id });

    if (!updatedUser) {
      throw new Error(`No se encontró el usuario con id ${id}`);}
    return updatedUser.id; // Ahora es seguro acceder a updatedUser .id
  }


  async deleteUser(id: string): Promise<string> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
  
    try {
      await this.usersRepository.remove(user);
      return id;
    } catch (error) {
      throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
  }
  
  async findEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }
}
