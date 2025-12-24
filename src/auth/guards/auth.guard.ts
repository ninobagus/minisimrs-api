import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Authorization header is required',
        error: 'Unauthorized',
      });
    }

    // Support both "Bearer token" and "Basic username:password" formats
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = this.authService.validateToken(token);

      if (!payload) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Invalid or expired token',
          error: 'Unauthorized',
        });
      }

      request.user = payload;
      return true;
    }

    if (authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.substring(6);
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');

      const user = this.authService.validateUser(username, password);

      if (!user) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Invalid username or password',
          error: 'Unauthorized',
        });
      }

      request.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      return true;
    }

    throw new UnauthorizedException({
      statusCode: 401,
      message: 'Invalid authorization format. Use "Bearer <token>" or "Basic <base64>"',
      error: 'Unauthorized',
    });
  }
}
