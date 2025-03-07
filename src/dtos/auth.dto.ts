// src/dtos/auth.dto.ts
import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./users.dto";
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class LoginUserDto extends PickType(CreateUserDto, [
    'email',
    'password'
]){}


export class SignupUserDto extends CreateUserDto {
     /**
   * @example "Debe ser la misma que la primera password,ejemplo:Admin123!"
   * @description Confirmacion de la contraseña del usuario
   */
    @IsString()
    @IsNotEmpty()
    @Length(8, 15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, {
        message: 'La contraseña de confirmación debe contener al menos: una letra minúscula, una letra mayúscula, un número y un carácter especial 🧐',
    })
    passwordConfirm: string;
}