import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) { }

  async signIn(loginDTO: LoginDTO): Promise<{ access_token: string }> {
    const user = await this.usuarioService.getUsuarioByCorreo(loginDTO.username);
    const checkPassword = await compare(loginDTO.pass, user.pass);
    if (!checkPassword) {
      throw new HttpException('Password Incorrect', HttpStatus.FORBIDDEN);
    }
    const payload = { role: user.idRol.tipo, username: user.correo };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
