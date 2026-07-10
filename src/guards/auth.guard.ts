import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { clientConfig } from 'src/config/client.config';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const clientId = this.extractClientIdFromAuthHeader(request);
    const client = clientConfig.filter((f) => f.id === clientId).shift();
    if (!clientId || !client) {
      throw new UnauthorizedException('Missing/Invalid client ID');
    }

    request.consumer = client;

    return true;
  }

  private extractClientIdFromAuthHeader(request: Request): string | undefined {
    const [type, clientId] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? clientId : undefined;
  }
}
