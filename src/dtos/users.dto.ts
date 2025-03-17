import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  IsNumber,
  IsOptional,
  MinLength,
  IsEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Ingresa tu nombre',
    example: 'Fulanita',
    minLength: 3,
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 80, { message: 'El nombre debe tener entre 3 y 80 caracteres' })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'fulanita_ok@test.com',
  })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Admin123!',
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'La contraseña debe tener al menos 5 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, {
    message:
      'La contraseña debe contener al menos: una letra minúscula, una letra mayúscula, un número y un carácter especial 🧐',
  })
  password: string;

  @ApiProperty({
    description: 'Ingresa tu dirección',
    example: 'Av avellaneda 123',
    minLength: 3,
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 80, { message: 'La dirección debe tener entre 3 y 80 caracteres' })
  address: string;

  @ApiProperty({
    description: 'Número de teléfono (solo números)',
    example: 1144569815,
    type: Number,
  })
  @IsNumber({}, { message: 'El teléfono debe ser un número válido' })
  @IsNotEmpty()
  phone: number;

  @ApiHideProperty()
  @IsEmpty()
  isAdmin?: boolean;

  @ApiProperty({
    description: 'País de residencia',
    example: 'Argentina',
    required: false,
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @Length(2, 50, { message: 'El país debe tener entre 2 y 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  country?: string;

  @ApiProperty({
    description: 'Ciudad o provincia',
    example: 'Buenos Aires',
    required: false,
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @Length(2, 50, { message: 'La ciudad debe tener entre 2 y 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  city?: string;
}