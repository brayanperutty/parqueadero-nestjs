import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { RolModule } from '../rol/rol.module';
import { UsuarioResponses } from './responses/usuario.error.responses';
import { Parqueadero } from 'src/parqueadero/parqueadero.entity';
import { ParqueaderoModule } from 'src/parqueadero/parqueadero.module';
import { ParqueaderoResponses } from 'src/parqueadero/responses/parqueadero.responses';
import { UsuarioCreateResponse } from './responses/usuario.create.response';
import { UsuarioVinculacionResponse } from './responses/usuario.vinculacion.response';
import { UsuarioDesvincularResponse } from './responses/usuario.desvincular.response';

@Module({
  imports:[TypeOrmModule.forFeature([Usuario, Parqueadero]), RolModule, ParqueaderoModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioResponses, ParqueaderoResponses, UsuarioCreateResponse, UsuarioVinculacionResponse, UsuarioDesvincularResponse],
  exports: [UsuarioService]
})
export class UsuarioModule {}