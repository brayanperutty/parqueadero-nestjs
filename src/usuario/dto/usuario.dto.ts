import { PartialType } from '@nestjs/mapped-types';
import { Equals, IsAlphanumeric, IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength, MinLength} from 'class-validator';

export class CreateUsuarioDTO {
        
        @IsNotEmpty({message: 'El campo cédula no debe estar vacío'})
        @MinLength(6, {message: 'El campo cédula debe contener mínimo 6 dígitos'})
        @MaxLength(10, {message: 'El campo cédula debe contener máximo 10 dígitos'})
        @IsNumberString()
        cedula: string

        @IsString({message: 'El campo correo debe ser una cadena de texto'})
        @IsNotEmpty({message: 'El campo correo no debe estar vacío'})
        @IsEmail()
        correo: string

        @IsString({message: 'El campo del nombre debe ser una cadena de texto'})
        @IsNotEmpty({message: 'El campo del nombre no debe estar vacío'})
        nombreCompleto: string

        @IsAlphanumeric()
        @IsNotEmpty({message: 'El campo de la contraseña no debe estar vacío'})
        pass: string

        @IsNumber()
        @IsNotEmpty({message: 'El campo del rol no debe estar vacío'})
        @Equals(2, { message: 'El idRol debe ser el correspondiente al id del rol SOCIO' })
        idRol: number
}

export class UpdateUsuarioDTO extends PartialType(CreateUsuarioDTO) {}

export class FindOneParams {
        @IsNumber()
        idUsuario: number;
}