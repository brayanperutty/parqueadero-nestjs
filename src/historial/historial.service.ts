import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Historial } from './historial.entity';
import { IsNull, Repository } from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { CreateHistorialDTO } from './dto/historial.dto';
import { Ingreso } from 'src/ingreso/ingreso.entity';
import { Vehiculo } from 'src/vehiculo/vehiculo.entity';
import { Parqueadero } from 'src/parqueadero/parqueadero.entity';
import { HistorialCreateResponse } from './responses/historial.create.response';

@Injectable()
export class HistorialService {

    constructor(@InjectRepository(Historial)
                private historialRepository: Repository<Historial>,
                @InjectRepository(Usuario)
                private usuarioRepository: Repository<Usuario>,
                @InjectRepository(Ingreso)
                private ingresoRepository: Repository<Ingreso>,
                @InjectRepository(Vehiculo)
                private vehiculoRepository: Repository<Vehiculo>,
                @InjectRepository(Parqueadero)
                private parqueaderoRepository: Repository<Parqueadero>,
                private historialCreateResponse: HistorialCreateResponse,
    ){}

    getListHistorial(): Promise<Historial[]>{
        return this.historialRepository.find();
    }

    getHistorial(idHistorial: number): Promise<Historial | null>{
        return this.historialRepository.findOneBy({ idHistorial });
    }

    async deleteHistorial(idHistorial: number): Promise<void>{
        await this.historialRepository.delete(idHistorial);
    }

    async createHistorial(historialDTO: CreateHistorialDTO, correo: string){
        const ingreso = await this.getValidatePlacaParqueadero(historialDTO.placa, historialDTO.idParqueadero);

        if(!await this.getValidateUsuarioParqueadero(correo)){
           throw new HttpException('Este parqueadero no corresponde a este socio', HttpStatus.BAD_REQUEST);
        }else if(!ingreso){
            throw new HttpException('No se puede Registrar Salida, no existe la placa en el parqueadero', HttpStatus.BAD_REQUEST);
        }else{
            
            const fechaHoy = new Date();
            const tiempo = Math.round(((Math.floor(fechaHoy.getTime()/1000) - Math.floor(ingreso.fechaHoraIngreso.getTime()/1000)) / 60)/60);
            var cobro: bigint;
            
            if(ingreso.vehiculo.tipo.tipo === 'MOTO'){
                cobro = BigInt((Math.round(tiempo) < 1 ? 1 : tiempo + 1) * ingreso.parqueadero.costoHoraMoto);
            }else{
                cobro = BigInt((Math.round(tiempo) < 1 ? 1 : tiempo + 1) * ingreso.parqueadero.costoHoraCarro);
            }

            var idHistorial = Math.floor(Math.random() * 1000000);

            while(await this.historialRepository.findOneBy({idHistorial})){
                var idHistorialNuevo = Math.floor(Math.random() * 1000000);
                idHistorial = idHistorialNuevo;
            }

            const historial = new Historial();
            historial.idHistorial = idHistorial;
            historial.fechaHoraIngreso = ingreso.fechaHoraIngreso;
            historial.fechaHoraSalida = fechaHoy;
            historial.cobro = cobro;
            historial.parqueadero = ingreso.parqueadero;
            historial.vehiculo = ingreso.vehiculo;

            this.historialRepository.save(historial);
            this.ingresoRepository.delete(ingreso.idIngreso);

            return this.historialCreateResponse;
        }
    }

    private async getValidateUsuarioParqueadero(correo: string): Promise<boolean>{
        const usuario = await this.usuarioRepository.findOne({
            where: {correo: correo},
        });
        return usuario === null ? false : true;
    }

    private async getValidatePlacaParqueadero(placa: string, idParqueadero: number): Promise<Ingreso>{

        const vehiculo = await this.vehiculoRepository.findOneBy({placa});
        const parqueadero = await this.parqueaderoRepository.findOneBy({idParqueadero});

        const ingreso = await this.ingresoRepository.findOne({
            where: {vehiculo: vehiculo || IsNull(), parqueadero: parqueadero || IsNull()},
            relations: ['vehiculo', 'vehiculo.tipo', 'parqueadero'],
        });

        return ingreso ? ingreso : null;
    }
    
    extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') || [];
        return type === 'Bearer' ? token : undefined;
    }

}
