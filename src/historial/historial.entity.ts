import { Parqueadero } from '../parqueadero/parqueadero.entity';
import { Vehiculo } from '../vehiculo/vehiculo.entity';
import { BaseEntity, Column, Entity, Long, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('historial')
export class Historial extends BaseEntity {

    @PrimaryColumn({type: 'int', name: 'id_historial', nullable:false })
    idHistorial: number;

    @ManyToOne(() => Parqueadero, (parqueadero) => parqueadero.historial, {nullable:false})
    parqueadero: Parqueadero;

    @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.historial, {nullable:false})
    vehiculo: Vehiculo;

    @Column({type: 'timestamp without time zone', precision: 6, nullable:false, name: 'fecha_hora_ingreso'})
    fechaHoraIngreso: Date;

    @Column({type: 'timestamp without time zone', precision: 6, nullable:false, name: 'fecha_hora_salida'})
    fechaHoraSalida: Date;

    @Column({type: 'bigint', nullable:false, name: 'cobro'})
    cobro: Long;
}