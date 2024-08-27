import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Historial } from './historial.entity';
import { Repository } from 'typeorm';
import { Vehiculo } from 'src/vehiculo/vehiculo.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateHistorialDTO } from './dto/historial.dto';
import { Parqueadero } from 'src/parqueadero/parqueadero.entity';

@Injectable()
export class HistorialService {

    constructor(@InjectRepository(Historial)
                private historialRepository: Repository<Historial>,
                @InjectRepository(Usuario)
                private usuarioRepository: Repository<Usuario>,
                private jwtService: JwtService
    ){}

    getListHistorial(): Promise<Historial[]>{
        return this.historialRepository.find();
    }

    getHistorial(idHistorial: number): Promise<Historial | null>{
        return this.historialRepository.findOneBy({ idHistorial });
    }

    async deleteHistorial(idHistorial: number): Promise<void>{
        await this.historialRepository.delete(idHistorial);
    }

    async createHistorial(historialDTO: CreateHistorialDTO, correo: string){
        if(await this.getValidateUsuarioParqueadero(correo)){
           throw new HttpException('Este parqueadero no corresponde a este socio', HttpStatus.BAD_REQUEST);
        }else{
            return 'hola';
        }
    }

    private async getValidateUsuarioParqueadero(correo: string): Promise<boolean>{
        const usuario = await this.usuarioRepository.findOne({
            where: { correo: correo},
        });
        return usuario === null ? false : true;
    }
    
    extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') || [];
        return type === 'Bearer' ? token : undefined;
    }

}
