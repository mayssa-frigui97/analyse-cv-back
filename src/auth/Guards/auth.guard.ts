import { ExecutionContext, HttpException, HttpStatus, Injectable, CanActivate } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class authGuard  extends AuthGuard('jwt'){
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const ctx = GqlExecutionContext.create(context).getContext();
  //   if (!ctx.headers.authorization) {
  //     return false;
  //   }
  //   ctx.user = await this.validateToken(ctx.headers.authorization);
  //   return true;
  // }

  // async validateToken(auth: string) {
  //   if (auth.split(' ')[0] !== 'Bearer') {
  //     throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  //   }
  //   const token = auth.split(' ')[1];

  //   try {
  //     const decoded = jwt.verify(token, 'secret');
  //     return decoded;
  //   } catch (err) {
  //     const message = 'Token error: ' + (err.message || err.name);
  //     throw new HttpException(message, HttpStatus.UNAUTHORIZED);
  //   }
  // }
}