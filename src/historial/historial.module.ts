import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historial } from './historial.entity';
import { Usuario } from 'src/usuario/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Historial, Usuario])],
  providers: [HistorialService],
  controllers: [HistorialController],
  exports: [HistorialService]
})
export class HistorialModule {}
