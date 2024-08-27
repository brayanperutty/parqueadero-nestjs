import { Ingreso } from '../ingreso/ingreso.entity';
import { TipoVehiculo } from '../tipo_vehiculo/tipo_vehiculo.entity';
import { Historial } from '../historial/historial.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('vehiculo')
export class Vehiculo extends BaseEntity {

    @PrimaryColumn({type: 'varchar', length: 6, name: 'placa', nullable:false })
    placa: string;

    @Column({type: 'varchar', length:255, name: 'marca', nullable:false})
    marca: string;

    @Column({type: 'varchar', length:255, name: 'modelo', nullable:false})
    modelo: string;

    @Column({type: 'varchar', length:255, name: 'color', nullable:false})
    color: string;

    @ManyToOne(() => TipoVehiculo, (tipo) => tipo.vehiculo)
    @JoinColumn({name: 'id_tipo'})
    tipo: TipoVehiculo;

    @OneToMany(() => Ingreso, (ingreso) => ingreso.vehiculo)
    ingresos: Ingreso[];

    @OneToMany(() => Historial, (historial) => historial.vehiculo)
    historial: Historial[];
}