import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/rol/roles.guard';
import { CreateIngresoDTO } from './dto/ingreso.dto';
import { IngresoService } from './ingreso.service';
import { Roles } from 'src/rol/rol-constants';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ingreso')
export class IngresoController {

    constructor(
        private ingresoService: IngresoService,
    ){}

    @Roles('SOCIO')
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    createIngreso(@Body() ingresoDTO: CreateIngresoDTO){
        return this.ingresoService.createIngreso(ingresoDTO);
    }

}
