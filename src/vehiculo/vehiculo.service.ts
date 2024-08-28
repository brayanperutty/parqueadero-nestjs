import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehiculo } from './vehiculo.entity';
import { IsNull, Repository } from 'typeorm';
import { TipoVehiculo } from 'src/tipo_vehiculo/tipo_vehiculo.entity';
import { VehiculoErrorResponses } from './responses/vehiculo.error.responses';

@Injectable()
export class VehiculoService {

    constructor(
        @InjectRepository(Vehiculo)
        private vehiculoRepository: Repository<Vehiculo>,
        @InjectRepository(TipoVehiculo)
        private tipoVehiculoRepository: Repository<TipoVehiculo>,
        private vehiculoErrorResponse: VehiculoErrorResponses,
    ){}

    async createVehiculo(placa: string, marca: string, modelo: string, color: string, idTipo: number){
        const tipoVehiculo = await this.tipoVehiculoRepository.findOneBy({ idTipo });

        const vehiculoNuevo = new Vehiculo();
        vehiculoNuevo.placa = placa;
        vehiculoNuevo.marca = marca;
        vehiculoNuevo.modelo = modelo;
        vehiculoNuevo.color = color;
        vehiculoNuevo.tipo = tipoVehiculo;

        await this.vehiculoRepository.save(vehiculoNuevo);
    }

    async filtroVehiculo(placa: string): Promise<Vehiculo>{
        const vehiculo = await this.vehiculoRepository.findOne({
            where: {placa: placa},
            relations: ['tipo']
        });
        return vehiculo !== null ? vehiculo : null;
    }
}
