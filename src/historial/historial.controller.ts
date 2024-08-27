import { Body, Controller, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateHistorialDTO } from './dto/historial.dto';
import { HistorialService } from './historial.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/rol/roles.guard';
import { Roles } from 'src/rol/rol-constants';
import { JwtService } from '@nestjs/jwt';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('historial')
export class HistorialController {
    constructor(
        private historialService: HistorialService,
        private jwtService: JwtService
    ){}

    @Roles('SOCIO')
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createSalida(@Body() historialDTO: CreateHistorialDTO, @Request() req){
        const token = this.historialService.extractTokenFromHeader(req);
        const decoded = await this.jwtService.verifyAsync(token)
        return this.historialService.createHistorial(historialDTO, decoded.username);
    }
}
