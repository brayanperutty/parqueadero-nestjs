import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsuarioService } from './usuario.service'
import { CreateUsuarioDTO } from './dto/usuario.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { plainToClass } from 'class-transformer';
import { Usuario } from './usuario.entity';
import { Rol } from 'src/rol/rol.entity';
import { RolesGuard } from 'src/rol/roles.guard';
import { Roles } from 'src/rol/rol-constants';
import { ParqueaderoVincularDTO } from 'src/parqueadero/dto/parqueaderoVincular.dto';

interface RequestWithUser extends Request{
    user: {
        rol: Rol;
    }
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuario')
export class UsuarioController {

    constructor(
        private usuarioService : UsuarioService
    ){}

    @Roles('ADMIN')
    @Get()
    getListUsuarios(@Req() req: RequestWithUser){
        return plainToClass(Usuario, this.usuarioService.getListUsuarios());
    }

    @Roles('ADMIN', 'SOCIO')
    @Get(':idUsuario')
    getUsuario(@Param('idUsuario') idUsuario: number){
        return plainToClass(Usuario, this.usuarioService.getUsuario(idUsuario));
    }

    
    @Roles('ADMIN')
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    createUsuario(@Body() usuario: CreateUsuarioDTO){
        return this.usuarioService.createUsuario(usuario);
    }

    @Roles('ADMIN')
    @Post('vincular/:idUsuario')
    vincularSocioParqueadero(@Param('idUsuario') idUsuario: number, @Body() idParqueaderos: ParqueaderoVincularDTO){
        return this.usuarioService.vincularSocioParqueadero(idUsuario, idParqueaderos);
    }

    @Roles('ADMIN')
    @Delete(':idUsuario')
    deleteUsuario(@Param('idUsuario') idUsuario: number){
        return this.usuarioService.deleteUsuario(idUsuario);
    }

    @Roles('ADMIN')
    @Post('desvincular/:idUsuario')
    desvincularSocioParqueadero(@Param('idUsuario') idUsuario: number, @Body() idParqueaderos: ParqueaderoVincularDTO){
        return this.usuarioService.desvincularSocioParqueadero(idUsuario, idParqueaderos)
    }
    
}
