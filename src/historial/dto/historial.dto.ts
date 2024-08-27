import { IsNotEmpty, IsNumber   , IsString, MaxLength, MinLength } from "class-validator";

export class CreateHistorialDTO {

    @IsNumber()
    @IsNotEmpty()
    idParqueadero: number;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(6)
    @IsString()
    placa: string;
}