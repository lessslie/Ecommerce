import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from 'src/dtos/users.dto';



@Injectable()
export class UsersService {

  constructor(private readonly usersRepository: UsersRepository) {}
  
  async getUsersService() {
    return await this.usersRepository.getUsers();
  }
  getUserById(id:string){
    return this.usersRepository.getUserById(id);
  }
  
  createUser(newUser:CreateUserDto){
    return this.usersRepository.createUser(newUser);
  }



  updateUser(id:string,updateUser:CreateUserDto){
    return this.usersRepository.updateUser(id,updateUser);
  }

  deleteUser(id:string){
    return this.usersRepository.deleteUser(id);
  }



}