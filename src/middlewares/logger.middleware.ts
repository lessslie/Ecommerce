import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentDate = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });
    console.log(
      `Estas ejecutando un metodo ${req.method} en la ruta ${req.originalUrl} , la fecha y hora son : ${currentDate}`,
    );
    next();
  }
}