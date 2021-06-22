/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { CollaborateurService } from './../../collaborateur/collaborateur.service';
import { ROLES_KEY } from './../../decorators/role.decorator';
import { UserRole } from './../../enum/UserRole';



// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) {
//       return true;
//     }
//     const { user } = context.switchToHttp().getRequest();

//     return requiredRoles.some((role) => user.role?.includes(role));
//   }
// }

//   // canActivate(context: ExecutionContext): boolean {
//   //   const roles = this.reflector.get<string[]>('roles', context.getHandler());
//   //   if (!roles) {
//   //     return true;
//   //   }
//   //   const request = context.switchToHttp().getRequest();
//   //   const user = request.user;
//   //   return matchRoles(roles, user.role);
//   // }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const roles =
//       this.reflector.getAllAndMerge<UserRole[]>('roles', [
//         context.getClass(),
//         context.getHandler(),
//       ]) || [];

//     const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!roles || isPublic) {
//       return true;
//     }

//     let isAllowed = false;

//     roles.forEach((role) => {
//       if (context.switchToHttp().getRequest().request.user.role === role) {
//         isAllowed = true;
//       }
//     });

//     return isAllowed;
//   }
// }


const matchRoles = (roles, userRoles) => {
  return roles.some(role => role === userRoles);
};

@Injectable()
export class RolesGuard implements CanActivate {
  
  constructor(private reflector: Reflector,
    private collaborateurService: CollaborateurService) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<UserRole[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
      console.log("roles: ", roles);
      // console.log("request: ", context.switchToHttp().getRequest());
      // console.log("gqlContext: ", ctx.getContext().req);

    // const request = context.switchToHttp().getRequest();
    const user = ctx.getContext().req.user;
    // const req = context.switchToHttp().getRequest() as any;
    // const user = req.user;
    // console.log("user:",user);
    const userauth = await this.collaborateurService.findOneCol(user.id);
    // console.log("userauth:",userauth.role);
    // console.log("cond:",roles.includes(userauth.role));
    return (roles.includes(userauth.role));

    // return true;
  }

}
