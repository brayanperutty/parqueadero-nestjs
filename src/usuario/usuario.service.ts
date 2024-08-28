import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDTO } from './dto/usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolService } from '../rol/rol.service';
import { hash } from 'bcrypt';
import { UsuarioResponses } from './responses/usuario.error.responses';
import { Parqueadero } from '../parqueadero/parqueadero.entity';
import { ParqueaderoVincularDTO } from 'src/parqueadero/dto/parqueaderoVincular.dto';
import { UsuarioVinculacionResponse } from './responses/usuario.vinculacion.response';
import { UsuarioCreateResponse } from './responses/usuario.create.response';
import { UsuarioDesvincularResponse } from './responses/usuario.desvincular.response';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(Usuario)
        private usersRepository: Repository<Usuario>,
        @InjectRepository(Parqueadero)
        private parqueaderoRepository: Repository<Parqueadero>,
        private rolService: RolService,
        private usuarioResponse: UsuarioResponses,
        private usuarioCreateResponse: UsuarioCreateResponse,
        private usuarioVinculacionResponse: UsuarioVinculacionResponse,
        private usuarioDesvinculacionResponse: UsuarioDesvincularResponse,
    ) { }

    getListUsuarios(): Promise<Usuario[]> {
        return this.usersRepository.find();
    }

    getUsuario(idUsuario: number): Promise<Usuario> {
        const usuario = this.usersRepository.findOneBy({ idUsuario });
        return this.usersRepository.findOneBy({ idUsuario }) ? usuario
            : (() => { throw new HttpException(this.usuarioResponse.usuarioNotFound, HttpStatus.BAD_REQUEST) })();
    }

    getUsuarioByCorreo(correo: string): Promise<Usuario | null> {
        const usuario = this.usersRepository.findOneBy({ correo });
        return this.usersRepository.findOneBy({ correo }) ? usuario
            : (() => { throw new HttpException(this.usuarioResponse.usuarioNotFound, HttpStatus.BAD_REQUEST) })();
    }

    async deleteUsuario(idUsuario: number): Promise<string> {
        return this.usersRepository.findOneBy({ idUsuario }) ? this.usuarioResponse.usuarioDeleted
            : (() => { throw new HttpException(this.usuarioResponse.usuarioNotFound, HttpStatus.BAD_REQUEST) })();
    }

    async createUsuario(usuarioDTO: CreateUsuarioDTO) {
        const cedula = usuarioDTO.cedula;
        if (this.usersRepository.findOneBy({ cedula })) {
            throw new HttpException(this.usuarioResponse.usuarioYaRegistrado, HttpStatus.BAD_REQUEST);
        } else {

            const passToHash = await hash(usuarioDTO.pass, 10);
            const rol = await this.rolService.getRol(usuarioDTO.idRol);

            const usuario = new Usuario();
            var idUsuario = Math.floor(Math.random() * 1000000);

            while (this.usersRepository.findOneBy({ idUsuario })) {
                var idUsuarioNuevo = Math.floor(Math.random() * 1000000);
                idUsuario = idUsuarioNuevo;
            }

            usuario.idUsuario = idUsuario;
            usuario.cedula = usuarioDTO.cedula;
            usuario.nombreCompleto = usuarioDTO.nombreCompleto;
            usuario.correo = usuarioDTO.correo;
            usuario.pass = passToHash;
            usuario.idRol = rol;

            this.usersRepository.save(usuario);
            return this.usuarioCreateResponse;
        }

    }

    async vincularSocioParqueadero(idUsuario: number, idParqueaderos: ParqueaderoVincularDTO) {

        const usuario = await this.usersRepository.findOne({
            where: { idUsuario: idUsuario },
            relations: ['parqueaderos'],
        });
        for(const p of idParqueaderos.idParqueadero) {

            const parqueadero = await this.parqueaderoRepository.findOne({ where: { idParqueadero: p } });

            if(usuario.parqueaderos.some(p => p.idParqueadero === parqueadero.idParqueadero)){
                throw new HttpException(this.usuarioResponse.parqueaderoYaVinculadoAlSocio + "[ " + parqueadero.nombre + " ]", HttpStatus.BAD_REQUEST);
            }

            if (!usuario || !parqueadero) {
                throw new HttpException('Usuario o Parqueadero no encontrado', HttpStatus.BAD_REQUEST);
            }else{
                usuario.parqueaderos.push(parqueadero);
            }
        }

        await this.usersRepository.save(usuario);
        return this.usuarioVinculacionResponse;
    }

    async desvincularSocioParqueadero(idUsuario: number, idParqueaderos: ParqueaderoVincularDTO){
        const usuario = await this.usersRepository.findOne({
            where: {idUsuario: idUsuario},
            relations: ['parqueaderos'],
        });

        for(const p of idParqueaderos.idParqueadero) {
            const parqueadero = await this.parqueaderoRepository.findOne({ where: { idParqueadero: p } });
            usuario.parqueaderos = usuario.parqueaderos.filter(parqueadero => parqueadero.idParqueadero !== p);
        }

        await this.usersRepository.save(usuario);

        return this.usuarioDesvinculacionResponse;
    }

}
