// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WorkStreamAuditMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res;
    const { method, url, body, headers } = req;

    // If AuthGuard has already run, you may access req.user
    const user = req['user'];

    console.log('Request:', {
      method,
      url,
      headers,
      body,
      user,
    });

    next(); // Always call next
  }
}
