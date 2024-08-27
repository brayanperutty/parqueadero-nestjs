import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Usuario } from './usuario/usuario.entity';
import { Parqueadero } from './parqueadero/parqueadero.entity';
import { Historial } from './historial/historial.entity';
import { Ingreso } from './ingreso/ingreso.entity';
import { Vehiculo } from './vehiculo/vehiculo.entity';
import { TipoVehiculo } from './tipo_vehiculo/tipo_vehiculo.entity';
import { Rol } from './rol/rol.entity';
import { ParqueaderoModule } from './parqueadero/parqueadero.module';
import { RolModule } from './rol/rol.module';
import { IngresoModule } from './ingreso/ingreso.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TipoVehiculoModule } from './tipo_vehiculo/tipo_vehiculo.module';
import { HistorialModule } from './historial/historial.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsuarioModule,
    ParqueaderoModule,
    RolModule,
    IngresoModule,
    VehiculoModule,
    TipoVehiculoModule,
    HistorialModule,
    AuthModule,
    TypeOrmModule.forRoot({
    type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1379',
      database: 'parqueadero-nest',
      entities: [Usuario, Parqueadero, Rol, Historial, Ingreso, Vehiculo, TipoVehiculo],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource){}
}
