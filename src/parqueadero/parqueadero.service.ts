import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Parqueadero } from './parqueadero.entity';
import { CreateParqueaderoDTO, UpdateParqueaderoDTO } from './dto/parqueadero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParqueaderoResponses } from './responses/parqueadero.responses';
import { ParqueaderoCreateResponse } from './responses/parqueaderoCreateResponse';

@Injectable()
export class ParqueaderoService {

    constructor(
        @InjectRepository(Parqueadero)
        private parqueaderoRepository: Repository<Parqueadero>,
        private parqueaderoResponse: ParqueaderoResponses,
        private parqueaderoCreateResponse: ParqueaderoCreateResponse
    ) { }

    getListParqueadero(): Promise<Parqueadero[]> {
        return this.parqueaderoRepository.find();
    }

    getListParqueaderosBySocio(idSocio: number): Promise<Parqueadero[]> {
        return this.parqueaderoRepository.find({
            where: { socios: { idUsuario: idSocio } },
            relations: ['usuario_id'], 
          });
    }

    getParqueadero(idParqueadero: number): Promise<Parqueadero | null> {
        const parqueadero = this.parqueaderoRepository.findOneBy({ idParqueadero });
        return this.parqueaderoRepository.findOneBy({ idParqueadero }) ? parqueadero
            : (() => { throw new HttpException(this.parqueaderoResponse.parqueaderoNotFound, HttpStatus.BAD_REQUEST) })();
    }

    async deleteParqueadero(idParquadero: number): Promise<string> {
        return await this.parqueaderoRepository.delete(idParquadero) ? this.parqueaderoResponse.parqueaderoDeleted
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

}
