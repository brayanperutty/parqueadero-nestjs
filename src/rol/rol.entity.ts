import { Usuario } from '../usuario/usuario.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('rol')
export class Rol extends BaseEntity {

    @PrimaryColumn({type: 'int', name: 'id_rol', nullable:false })
    idRol: number;

    @Column({type: 'varchar', nullable:false, name: 'tipo'})
    tipo: string;

    @OneToMany(() => Usuario, (usuario) => usuario.idRol)
    socios: Usuario[];
}