import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historial } from './historial.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Ingreso } from 'src/ingreso/ingreso.entity';
import { Vehiculo } from 'src/vehiculo/vehiculo.entity';
import { Parqueadero } from 'src/parqueadero/parqueadero.entity';
import { HistorialCreateResponse } from './responses/historial.create.response';

@Module({
  imports: [TypeOrmModule.forFeature([Historial, Usuario, Ingreso, Vehiculo, Parqueadero])],
  providers: [HistorialService, HistorialCreateResponse],
  controllers: [HistorialController],
  exports: [HistorialService]
})
export class HistorialModule {}
