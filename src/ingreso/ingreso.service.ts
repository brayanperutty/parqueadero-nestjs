import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateIngresoDTO } from './dto/ingreso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingreso } from './ingreso.entity';
import { Repository } from 'typeorm';
import { Vehiculo } from 'src/vehiculo/vehiculo.entity';
import { IngresoErrorResponse } from './responses/ingresos.error.response';
import { Parqueadero } from 'src/parqueadero/parqueadero.entity';
import { IngresoCreateResponse } from './responses/ingreso.create.response';
import { TipoVehiculo } from 'src/tipo_vehiculo/tipo_vehiculo.entity';

@Injectable()
export class IngresoService {

    constructor(
        @InjectRepository(Ingreso)
        private ingresoRepository: Repository<Ingreso>,
        @InjectRepository(Vehiculo)
        private vehiculoRepository: Repository<Vehiculo>,
        @InjectRepository(Parqueadero)
        private parqueaderoRepository: Repository<Parqueadero>,
        @InjectRepository(TipoVehiculo)
        private tipoVehiculoRepository: Repository<TipoVehiculo>,
        private ingresoErrorResponse: IngresoErrorResponse,
    ) {}

    async createIngreso(ingresoDTO: CreateIngresoDTO) {

        const placa: string = ingresoDTO.placaVehiculo;
        const idParqueadero: number = ingresoDTO.idParqueadero;
        const idTipo: number = ingresoDTO.idTipoVehiculo;

        if(await this.vehiculoRepository.findOneBy({ placa }) === null){

            const tipoVehiculo = await this.tipoVehiculoRepository.findOneBy({ idTipo });
    
            const vehiculoNuevo = new Vehiculo();
            vehiculoNuevo.placa = placa;
            vehiculoNuevo.marca = ingresoDTO.marcaVehiculo;
            vehiculoNuevo.modelo = ingresoDTO.modeloVehiculo;
            vehiculoNuevo.color = ingresoDTO.colorVehiculo;
            vehiculoNuevo.tipo = tipoVehiculo;

            await this.vehiculoRepository.save(vehiculoNuevo);
        }

        if (await this.validateIngreso(placa)) {
            throw new HttpException(this.ingresoErrorResponse.placaYaRegistrada, HttpStatus.BAD_REQUEST);
        }else {

            const ingreso = new Ingreso();
            const vehiculo = await this.vehiculoRepository.findOneBy({placa});
            const parqueadero = await this.parqueaderoRepository.findOneBy({idParqueadero});
            var idIngreso = Math.floor(Math.random() * 1000000);
            const fecha = new Date();

            while (await this.ingresoRepository.findOneBy({ idIngreso })) {
                var idIngresoNuevo = Math.floor(Math.random() * 1000000);
                idIngreso = idIngresoNuevo;
            }
            
            ingreso.idIngreso = idIngreso;
            ingreso.fechaHoraIngreso = fecha;
            ingreso.parqueadero = parqueadero;
            ingreso.vehiculo = vehiculo;

            this.ingresoRepository.save(ingreso);
            const ingresoCreateResponse = new IngresoCreateResponse();
            ingresoCreateResponse.id = idIngreso;

            return JSON.stringify(ingresoCreateResponse);
        }
    }

    async validateIngreso(placa: string): Promise<boolean>{
        const vehiculo = await this.vehiculoRepository.findOneBy({placa});
        const validateIngreso = await this.ingresoRepository.findOneBy({ vehiculo });
        return validateIngreso === null ? false : true ;
    }

}
