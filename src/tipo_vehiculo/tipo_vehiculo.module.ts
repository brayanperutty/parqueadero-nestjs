import { Module } from '@nestjs/common';
import { TipoVehiculoService } from './tipo_vehiculo.service';
import { TipoVehiculoController } from './tipo_vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoVehiculo } from './tipo_vehiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoVehiculo])],
  providers: [TipoVehiculoService],
  controllers: [TipoVehiculoController]
})
export class TipoVehiculoModule {}
