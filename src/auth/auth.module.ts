import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/users.entity";
import { UsersRepository } from "src/users/users.repository";


@Module({
    imports:[TypeOrmModule.forFeature([User])],
    
    controllers:[AuthController],
    providers:[AuthService,UsersRepository],
})
export class AuthModule{}