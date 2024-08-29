import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Parqueadero } from './parqueadero.entity';
import { CreateParqueaderoDTO, UpdateParqueaderoDTO } from './dto/parqueadero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParqueaderoResponses } from './responses/parqueadero.responses';
import { ParqueaderoCreateResponse } from './responses/parqueaderoCreateResponse';
import { Usuario } from 'src/usuario/usuario.entity';
import { Ingreso } from 'src/ingreso/ingreso.entity';
import { Historial } from 'src/historial/historial.entity';
import { IndicadorGeneral } from 'src/indicadores/indicador.general';

@Injectable()
export class ParqueaderoService {

    constructor(
        @InjectRepository(Parqueadero)
        private parqueaderoRepository: Repository<Parqueadero>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(Ingreso)
        private ingresoRepository: Repository<Ingreso>,
        @InjectRepository(Historial)
        private historialRepository: Repository<Historial>,
        private parqueaderoResponse: ParqueaderoResponses,
        private parqueaderoCreateResponse: ParqueaderoCreateResponse
    ) { }

    getParqueadero(idParqueadero: number): Promise<Parqueadero | null> {
        const parqueadero = this.parqueaderoRepository.findOneBy({ idParqueadero });
        return this.parqueaderoRepository.findOneBy({ idParqueadero }) ? parqueadero
            : (() => { throw new HttpException(this.parqueaderoResponse.parqueaderoNotFound, HttpStatus.BAD_REQUEST) })();
    }

    async createParqueadero(parqueaderoDTO: CreateParqueaderoDTO) {

        const parqueaderoNuevo = new Parqueadero();

        var idParqueadero = Math.floor(Math.random() * 1000000);

        while(await this.parqueaderoRepository.findOneBy({ idParqueadero })){
            var idParqueaderoNuevo = Math.floor(Math.random() * 1000000);
            idParqueadero = idParqueaderoNuevo;
        }

        parqueaderoNuevo.idParqueadero = idParqueadero;
        parqueaderoNuevo.nombre = parqueaderoDTO.nombre;
        parqueaderoNuevo.capacidad = parqueaderoDTO.capacidad;
        parqueaderoNuevo.costoHoraCarro = parqueaderoDTO.costoHoraCarro;
        parqueaderoNuevo.costoHoraMoto = parqueaderoDTO.costoHoraMoto;


        this.parqueaderoRepository.save(parqueaderoNuevo);
        return this.parqueaderoCreateResponse;
    }

    async updateParqueadero(idParqueadero: number, parqueaderoDTO: UpdateParqueaderoDTO){
        const parqueadero = await this.parqueaderoRepository.findOneBy({idParqueadero});

        if(parqueadero){
            parqueadero.nombre = parqueaderoDTO.nombre;
            parqueadero.capacidad = parqueaderoDTO.capacidad;
            parqueadero.costoHoraCarro = parqueaderoDTO.costoHoraCarro;
            parqueadero.costoHoraMoto = parqueaderoDTO.costoHoraMoto;
    
            this.parqueaderoRepository.save(parqueadero);
            return this.parqueaderoResponse.parqueaderoUpdated;
        }else{
            throw new HttpException(this.parqueaderoResponse.parqueaderoNotFound, HttpStatus.BAD_REQUEST);
        }

    }

    async deleteParqueadero(idParquadero: number): Promise<string> {
         return await this.parqueaderoRepository.delete(idParquadero) ? this.parqueaderoResponse.parqueaderoDeleted
            : (() => { throw new HttpException(this.parqueaderoResponse.parqueaderoNotFound, HttpStatus.BAD_REQUEST) })();
    }

    getListParqueadero(): Promise<Parqueadero[]> {
        return this.parqueaderoRepository.find();
    }

    async getListParqueaderosBySocio(idSocio: number, correo: string){
        if((await this.usuarioRepository.findOne({where: {correo: correo}})).idRol.tipo === "ADMIN"){
            const parqueaderos = await this.parqueaderoRepository.find({
                where: { socios: { idUsuario: idSocio } },
            });
            return parqueaderos;
        }else{
            const parqueaderos = await this.parqueaderoRepository.find({
                where: { socios: { idUsuario: idSocio, correo: correo } },
            });
            return parqueaderos.length !== 0 ? parqueaderos : (() => {throw new HttpException('Usuario no permitido para esta operación', HttpStatus.BAD_REQUEST)})();
        }
    }

    async getListVehiculosByParqueadero(idParqueadero: number, correo: string){
        if((await this.usuarioRepository.findOne({where: {correo: correo}})).idRol.tipo === "ADMIN"){
            const ingresos = await this.ingresoRepository.find({
                where: {
                    parqueadero: { idParqueadero: idParqueadero }
                },
                relations: ['vehiculo'],
            });
            
            console.log(ingresos)
            return ingresos.map(ingreso => ingreso.vehiculo);
        }else{
            const ingresos = await this.ingresoRepository.find({
                where: {
                    parqueadero: { idParqueadero: idParqueadero, socios: {correo : correo} }
                },
                relations: ['vehiculo'],
            });
            return ingresos.length !== 0 ? ingresos.map(ingreso => ingreso.vehiculo) : (() => {throw new HttpException('Usuario no permitido para esta operación', HttpStatus.BAD_REQUEST)})();;
        }
    }

    async getIndicadorGeneral(){

        const vehiculos = (await this.historialRepository.find({relations:['vehiculo']})).map(historial => historial.vehiculo);
        
        return vehiculos.reduce((resultado, vehiculo) => {

            const registroExistente = resultado.find(r => r.placa === vehiculo.placa);
        
            if (registroExistente) {

                registroExistente.registros += 1;
            } else {

                resultado.push({ placa: vehiculo.placa, registros: 1 });
            }
        
            return resultado.sort().slice(0,5);
        }, []);
    }

    async validarPrimeraVez(idParqueadero: number){
        const vehiculos = (await this.historialRepository.find({where: {parqueadero: {idParqueadero}}, relations:['vehiculo']})).map(historial => historial.vehiculo);
        
        const registros = vehiculos.reduce((resultado, vehiculo) => {

            const registroExistente = resultado.find(r => r.placa === vehiculo.placa);
        
            if (registroExistente) {

                registroExistente.registros += 1;
            } else {

                resultado.push({ placa: vehiculo.placa, registros: 1 });
            }
        
            return resultado;
        }, []);

        const vehiculosPrimeraVez = registros.filter(registro => registro.registros === 1);

        return vehiculosPrimeraVez;
    }
}