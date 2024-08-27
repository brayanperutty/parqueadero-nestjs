import { Vehiculo } from '../vehiculo/vehiculo.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('tipo_vehiculo')
export class TipoVehiculo extends BaseEntity {

    @PrimaryColumn({type: 'int', name: 'id_tipo', nullable:false })
    idTipo: number;

    @Column({type: 'varchar', length:255, name: 'tipo', nullable:false})
    tipo: string;

    @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.tipo)
    vehiculo: Vehiculo[];
}