import { Module } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './vehiculo.entity';
import { TipoVehiculo } from 'src/tipo_vehiculo/tipo_vehiculo.entity';
import { VehiculoErrorResponses } from './responses/vehiculo.error.responses';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo, TipoVehiculo])],
  providers: [VehiculoService, VehiculoErrorResponses],
  controllers: [VehiculoController],
  exports: [VehiculoService]
})
export class VehiculoModule {}
