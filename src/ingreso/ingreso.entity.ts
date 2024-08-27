import { Parqueadero } from '../parqueadero/parqueadero.entity';
import { Vehiculo } from '../vehiculo/vehiculo.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('ingreso_vehiculo')
export class Ingreso extends BaseEntity{
    
    @PrimaryColumn({type: 'int', name: 'id_ingreso', nullable:false })
    idIngreso: number;

    @ManyToOne(() => Parqueadero, (parqueadero) => parqueadero.ingresos, {nullable:false})
    @JoinColumn({name: 'id_parqueadero'})
    parqueadero: Parqueadero;

    @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.ingresos, {nullable:false})
    @JoinColumn({name: 'placa_vehiculo'})
    vehiculo: Vehiculo;

    @Column({type: 'timestamp without time zone', precision: 6, name: 'fecha_hora_ingreso', nullable:false})
    fechaHoraIngreso: Date;

}