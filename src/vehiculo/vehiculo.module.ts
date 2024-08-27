import { Module } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './vehiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo])],
  providers: [VehiculoService],
  controllers: [VehiculoController],
  exports: [VehiculoService]
})
export class VehiculoModule {}
