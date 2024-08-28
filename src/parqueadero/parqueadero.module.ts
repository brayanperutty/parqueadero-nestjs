import { Module } from '@nestjs/common';
import { ParqueaderoController } from './parqueadero.controller';
import { ParqueaderoService } from './parqueadero.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parqueadero } from './parqueadero.entity';
import { ParqueaderoResponses } from './responses/parqueadero.responses';
import { ParqueaderoCreateResponse } from './responses/parqueaderoCreateResponse';
import { HistorialModule } from 'src/historial/historial.module';
import { Usuario } from 'src/usuario/usuario.entity';
import { Vehiculo } from 'src/vehiculo/vehiculo.entity';
import { Ingreso } from 'src/ingreso/ingreso.entity';
import { Historial } from 'src/historial/historial.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Parqueadero, Usuario, Ingreso, Historial]), HistorialModule],
  controllers: [ParqueaderoController],
  providers: [ParqueaderoService, ParqueaderoResponses, ParqueaderoCreateResponse],
  exports: [ParqueaderoService]
})
export class ParqueaderoModule {}
