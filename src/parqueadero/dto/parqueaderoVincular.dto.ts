import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class ParqueaderoVincularDTO{

    @IsNumber({}, { each: true })
    @IsNotEmpty({message: 'El campo de idParqueadero no debe estar vacío'})
    @Min(1, {each: true, message: 'El campo de idParqueadero debe ser mínimo 1'})
    idParqueadero: number[]
}