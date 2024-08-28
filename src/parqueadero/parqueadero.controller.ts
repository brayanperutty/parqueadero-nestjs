import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ParqueaderoService } from './parqueadero.service';
import { CreateParqueaderoDTO, FindOneParams } from './dto/parqueadero.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/rol/roles.guard';
import { Roles } from 'src/rol/rol-constants';
import { HistorialService } from 'src/historial/historial.service';
import { JwtService } from '@nestjs/jwt';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parqueadero')
export class ParqueaderoController {
    
    constructor(private parqueaderoService: ParqueaderoService,
        private historialService: HistorialService,
        private jwtService: JwtService,
    ){}

    @Roles('ADMIN', 'SOCIO')
    @Get('indicador')
    async getIndicadorGeneral(){
        return this.parqueaderoService.getIndicadorGeneral();
    }

    @Roles('ADMIN')
    @Get()
    getListParqueadero(){
        return this.parqueaderoService.getListParqueadero();
    }

    @Roles('ADMIN', 'SOCIO')
    @Get(':idSocio')
    async getListParqueaderosBySocio(@Param('idSocio') idSocio: number, @Request() req){
        
        const token = this.historialService.extractTokenFromHeader(req);
        const decoded = await this.jwtService.verifyAsync(token)
        return this.parqueaderoService.getListParqueaderosBySocio(idSocio, decoded.username);
    }

    @Roles('ADMIN', 'SOCIO')
    @Get(':idParqueadero')
    getParqueadero(@Param('idParqueadero') param: FindOneParams){
        return this.parqueaderoService.getParqueadero(param.idParqueadero);
    }

    @Roles('ADMIN')
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    createParqueadero(@Body() parqueadero: CreateParqueaderoDTO){
        return this.parqueaderoService.createParqueadero(parqueadero);
    }

    
    @Roles('ADMIN')
    @Delete(':idParqueadero')
    deleteParqueadero(@Param('idParqueadero') param: FindOneParams){
        this.parqueaderoService.deleteParqueadero(param.idParqueadero);
        
        return 'deleted';
    }

    @Roles('ADMIN', 'SOCIO')
    @Get(':idParqueadero/vehiculos')
    async listVehiculosByParqueadero(@Param('idParqueadero') idParqueadero: number, @Request() req){
        const token = this.historialService.extractTokenFromHeader(req);
        const decoded = await this.jwtService.verifyAsync(token)
        return this.parqueaderoService.getListVehiculosByParqueadero(idParqueadero, decoded.username);
    }

}
