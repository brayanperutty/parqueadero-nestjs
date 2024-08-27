import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ParqueaderoService } from './parqueadero.service';
import { CreateParqueaderoDTO, FindOneParams } from './dto/parqueadero.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/rol/roles.guard';
import { Roles } from 'src/rol/rol-constants';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parqueadero')
export class ParqueaderoController {

    constructor(private parqueaderoService: ParqueaderoService){}

    @Roles('ADMIN')
    @Get()
    getListParqueadero(){
        return this.parqueaderoService.getListParqueadero();
    }

    @Roles('ADMIN', 'SOCIO')
    @Get(':idSocio')
    getListParqueaderosBySocio(@Param('idSocio') idSocio: number){
        return this.parqueaderoService.getListParqueaderosBySocio(idSocio);
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

    @Delete(':idParqueadero')
    deleteParqueadero(@Param('idParqueadero') param: FindOneParams){
        this.parqueaderoService.deleteParqueadero(param.idParqueadero);

        return 'deleted';
    }
}
