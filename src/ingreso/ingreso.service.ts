import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateIngresoDTO } from './dto/ingreso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingreso } from './ingreso.entity';
import { Repository } from 'typeorm';
import { Vehiculo } from 'src/vehiculo/vehiculo.entity';
import { IngresoErrorResponse } from './responses/ingresos.error.response';
import { Parqueadero } from 'src/parqueadero/parqueadero.entity';
import { IngresoCreateResponse } from './responses/ingreso.create.response';
import { VehiculoService } from 'src/vehiculo/vehiculo.service';

@Injectable()
export class IngresoService {

    constructor(
        @InjectRepository(Ingreso)
        private ingresoRepository: Repository<Ingreso>,
        @InjectRepository(Parqueadero)
        private parqueaderoRepository: Repository<Parqueadero>,
        private ingresoErrorResponse: IngresoErrorResponse,
        private vehiculoService: VehiculoService,
    ) {}

    async getIngreso(idIngreso: number): Promise<Ingreso>{
        const ingreso = await this.ingresoRepository.findOneBy({idIngreso});
        return ingreso ? ingreso : (() => { throw new HttpException(this.ingresoErrorResponse.ingresoNotFound, HttpStatus.BAD_REQUEST)})();
    }

    getListIngresos(): Promise<Ingreso[]>{
        return this.ingresoRepository.find();
    }

    async createIngreso(ingresoDTO: CreateIngresoDTO) {

        const placa: string = ingresoDTO.placaVehiculo;
        const idParqueadero: number = ingresoDTO.idParqueadero;

        if(!await this.vehiculoService.filtroVehiculo(placa)){
            await this.vehiculoService.createVehiculo(
                placa, 
                ingresoDTO.marcaVehiculo, 
                ingresoDTO.modeloVehiculo,
                ingresoDTO.colorVehiculo,
                ingresoDTO.idTipoVehiculo);
        }
        if (await this.validateIngreso(placa)) {
            throw new HttpException(this.ingresoErrorResponse.placaYaRegistrada, HttpStatus.BAD_REQUEST);
        }else {

            const ingreso = new Ingreso();
            const vehiculo = await this.vehiculoService.filtroVehiculo(placa);
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
        const vehiculo = await this.vehiculoService.filtroVehiculo(placa);
        const validateIngreso = await this.ingresoRepository.findOneBy({ vehiculo });
        return validateIngreso === null ? false : true ;
    }

}
