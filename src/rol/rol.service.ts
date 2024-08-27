import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolService {

    constructor(
        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
    ){}

    getListRoles(): Promise<Rol[]>{
        return this.rolRepository.find();
    }

    getRol(idRol: number): Promise<Rol | null>{
        return this.rolRepository.findOneBy({ idRol });
    }
}
