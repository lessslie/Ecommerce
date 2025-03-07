import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/roles.enum';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
//       context.getHandler(),
//       context.getClass(),
//     ]);

    
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     // Verificar si el usuario y sus roles están definidos
//     if (!user || !user.role) {
//       throw new ForbiddenException(
//         'No tienes permisos para acceder a este recurso!',
//       );
//     }

//     // Asegurarse de que user.role sea un array
//     const userRoles = Array.isArray(user.role) ? user.role : [user.role];

//     const valid = requiredRoles.some((role: Role) => userRoles.includes(role));
//     if (!valid) {
//       throw new ForbiddenException(
//         'No tienes permisos para acceder a este recurso!',
//       );
//     }
//     return true;
//   }
// }
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener roles requeridos del decorador
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar si hay usuario en el request
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Si se requiere rol admin, verificar que el usuario sea admin
    if (requiredRoles.includes(Role.Admin)) {
      if (!user.isAdmin) {
        throw new ForbiddenException('Se requieren permisos de administrador');
      }
      return true;
    }

    // Para otros roles (en este caso solo User), permitir acceso
    return true;
  }
}