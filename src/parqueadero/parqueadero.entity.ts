import { Ingreso } from '../ingreso/ingreso.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Historial } from '../historial/historial.entity';
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";

@Entity('parqueadero')
export class Parqueadero extends BaseEntity {

    @PrimaryColumn({ type: 'int', name: 'id_parqueadero', nullable:false })
    idParqueadero: number;

    @Column({ type: 'varchar', length: 255, nullable:false, name: 'nombre', unique:true})
    nombre: string;

    @Column({ type: 'int', name: 'capacidad', nullable:false})
    capacidad: number;

    @Column({ type: 'int', name: 'costo_hora_carro', nullable:false})
    costoHoraCarro: number;

    @Column({ type: 'int', name: 'costo_hora_moto', nullable:false})
    costoHoraMoto: number;

    @ManyToMany(() => Usuario, (usuario) => usuario.parqueaderos)
    socios: Usuario[];

    @OneToMany(() => Ingreso, (ingreso) => ingreso.parqueadero)
    ingresos: Ingreso[];

    @OneToMany(() => Historial, (historial) => historial.parqueadero)
    historial: Historial[];
}