import { Exclude } from 'class-transformer';
import { Parqueadero } from '../parqueadero/parqueadero.entity';
import { Rol } from '../rol/rol.entity';
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn} from 'typeorm';

@Entity('usuario')
export class Usuario extends BaseEntity {

    @PrimaryColumn({type: 'int', name: 'id_usuario', nullable:false })
    idUsuario: number;

    @Column({type: 'varchar', length:10, nullable:false, name: 'cedula', unique:true})
    cedula: string;

    @Column({type: 'varchar', length:255, name: 'nombre_completo', nullable:false})
    nombreCompleto: string;

    @Column({type: 'varchar', length:255, name: 'correo', nullable:false})
    correo: string;

    @Column({type: 'varchar', length:255, name: 'pass', nullable:false})
    @Exclude()
    pass: string;

    @ManyToOne(() => Rol, rol => rol.socios, {nullable:false, eager: true})
    @JoinColumn({name: 'id_rol'})
    idRol: Rol;

    @ManyToMany(() => Parqueadero, (parqueadero) => parqueadero.socios)
    @JoinTable({
        name: 'usuario_parqueadero',
        joinColumn: {
            name: 'usuario_id',        
        },
        inverseJoinColumn: {
            name: 'parqueadero_id',
        }
    })
    parqueaderos: Parqueadero[];
}