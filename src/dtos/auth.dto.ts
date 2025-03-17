// src/dtos/auth.dto.ts
import { PickType, ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./users.dto";
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class LoginUserDto extends PickType(CreateUserDto, [
    'email',
    'password'
]){}

export class SignupUserDto extends CreateUserDto {
    @ApiProperty({
      description: 'Confirmación de la contraseña del usuario',
      example: 'Admin123!',
      minLength: 5,
      maxLength: 15,
    })
    @IsString()
    @IsNotEmpty()
    @Length(5, 15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, {
        message: 'La contraseña de confirmación debe contener al menos: una letra minúscula, una letra mayúscula, un número y un carácter especial 🧐',
    })
    passwordConfirm: string;
}