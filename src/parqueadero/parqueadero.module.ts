import { Module } from '@nestjs/common';
import { ParqueaderoController } from './parqueadero.controller';
import { ParqueaderoService } from './parqueadero.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parqueadero } from './parqueadero.entity';
import { ParqueaderoResponses } from './responses/parqueadero.responses';
import { ParqueaderoCreateResponse } from './responses/parqueaderoCreateResponse';
import { HistorialModule } from 'src/historial/historial.module';
import { Usuario } from 'src/usuario/usuario.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Parqueadero, Usuario]), HistorialModule],
  controllers: [ParqueaderoController],
  providers: [ParqueaderoService, ParqueaderoResponses, ParqueaderoCreateResponse],
  exports: [ParqueaderoService]
})
export class ParqueaderoModule {}
