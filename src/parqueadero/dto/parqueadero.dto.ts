import { PartialType } from "@nestjs/mapped-types"
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

export class CreateParqueaderoDTO {

    @IsString()
    @IsNotEmpty({message: 'El campo del nombre no debe estar vacío'})
    nombre: string

    @IsNumber()
    @IsNotEmpty({message: 'El campo de capacidad no debe estar vacío'})
    @Min(1, {message: 'El campo de capacidad debe ser mínimo 1'})
    capacidad: number

    @IsNumber()
    @IsNotEmpty({message: 'El campo de costo por hora para carros no debe estar vacío'})
    @Min(1, {message: 'El campo de costo por hora para carros debe ser mínimo 1'})
    costoHoraCarro: number
    
    @IsNumber()
    @IsNotEmpty({message: 'El campo de costo por hora para motos no debe estar vacío'})
    @Min(1, {message: 'El campo de costo por hora para motos debe ser mínimo 1'})
    costoHoraMoto: number
}

export class UpdateParqueaderoDTO extends PartialType(CreateParqueaderoDTO) {}

export class FindOneParams{
    @IsNumber()
    idParqueadero: number
}