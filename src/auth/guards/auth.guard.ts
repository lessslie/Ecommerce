
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Role } from 'src/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    // ahora deberia verse algo asi: 'Bearer: <token>'
    if (!authHeader)
      throw new UnauthorizedException('No hay header de autorization');

    const token = authHeader.split(' ')[1];
    // ['Barer', token]
    if (!token)
      throw new UnauthorizedException('No hay header de autorization');

    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });

      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);

      request.user = payload;


      if(payload.isAdmin){
        request.user.roles = [Role.Admin];
      }else{
        request.user.roles = [Role.User];
      }

      return true;
      
    } catch (err) {
      throw new UnauthorizedException('El token es invalido😲​');
    }
  }
}
