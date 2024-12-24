import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  handleRequest(err, user, info, context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const request = context.switchToHttp().getRequest();

    const allowAny = this.reflector.get<string[]>(
      'allow-any',
      context.getHandler(),
    );
    if (user) {
      // request.body.farmId = user.farmId;
      return user;
    }
    if (allowAny) return true;
    throw new UnauthorizedException();
  }
}
