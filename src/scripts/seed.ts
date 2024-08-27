import { DataSource } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Rol } from '../rol/rol.entity';
import { Parqueadero } from '../parqueadero/parqueadero.entity';
import { Historial } from '../historial/historial.entity';
import { Ingreso } from '../ingreso/ingreso.entity';
import { Vehiculo } from '../vehiculo/vehiculo.entity';
import { TipoVehiculo } from '../tipo_vehiculo/tipo_vehiculo.entity';
import { hash } from 'bcrypt';

const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: '1379',
    database: 'parqueadero-nest',
    entities: [Usuario, Parqueadero, Rol, Historial, Ingreso, Vehiculo, TipoVehiculo],
    synchronize: true,
});

async function seed() {

    await dataSource.initialize();

    const usuarioRepository = dataSource.getRepository(Usuario);
    const rolRepository = dataSource.getRepository(Rol);
    const tipoVehiculoRepository = dataSource.getRepository(TipoVehiculo);

    
    if(await rolRepository.count() === 0){
        const rol1 = new Rol();
        rol1.idRol = 1;
        rol1.tipo = 'ADMIN';

        const rol2 = new Rol();
        rol2.idRol = 2;
        rol2.tipo = 'SOCIO';
    
        await rolRepository.save([rol1, rol2]);
    };

    if(await tipoVehiculoRepository.count() === 0){
        const tipoVehiculo1 = new TipoVehiculo;
        tipoVehiculo1.idTipo = 1;
        tipoVehiculo1.tipo = 'MOTO';

        const tipoVehiculo2 = new TipoVehiculo;
        tipoVehiculo2.idTipo = 2;
        tipoVehiculo2.tipo = 'CARRO';

        await tipoVehiculoRepository.save([tipoVehiculo1, tipoVehiculo2]);
    };
    
    if(await usuarioRepository.count() === 0){

        const rol = await rolRepository.findOneBy({ idRol: 1 });

        if (rol) {
            const passToHash = await hash('admin', 10);
            const usuario1 = new Usuario();
            usuario1.idUsuario = Math.floor(Math.random() * 100000);
            usuario1.cedula = '123456789';
            usuario1.nombreCompleto = 'Administrador';
            usuario1.correo = 'admin@mail.com';
            usuario1.pass = passToHash;
            usuario1.idRol = rol;
            

            await usuarioRepository.save(usuario1);
            
        } else {
            console.error('El rol con idRol 1 no se encontró en la base de datos.');
        }
    };

    console.log('Datos precargados en la base de datos');
    await dataSource.destroy();
}

seed().catch((error) => console.error(error));
