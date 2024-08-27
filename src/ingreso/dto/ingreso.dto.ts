import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateIngresoDTO {

    @IsNumber()
    @IsNotEmpty()
    idParqueadero: number;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(6)
    @IsString()
    placaVehiculo: string;

    @IsNotEmpty()
    @IsString()
    marcaVehiculo: string;

    @IsNotEmpty()
    @IsString()
    modeloVehiculo: string;

    @IsNotEmpty()
    @IsString()
    colorVehiculo: string;

    @IsNumber()
    @IsNotEmpty()
    idTipoVehiculo: number;
}