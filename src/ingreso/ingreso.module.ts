import { Module } from '@nestjs/common';
import { IngresoService } from './ingreso.service';
import { IngresoController } from './ingreso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingreso } from './ingreso.entity';
import { IngresoErrorResponse } from './responses/ingresos.error.response';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';
import { Parqueadero } from 'src/parqueadero/parqueadero.entity';
import { IngresoCreateResponse } from './responses/ingreso.create.response';
import { TipoVehiculo } from 'src/tipo_vehiculo/tipo_vehiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingreso, Parqueadero, TipoVehiculo]), VehiculoModule],
  providers: [IngresoService, IngresoErrorResponse, IngresoCreateResponse],
  controllers: [IngresoController],
  exports: [IngresoService]
})
export class IngresoModule {}
