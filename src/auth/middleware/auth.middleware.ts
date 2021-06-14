/* eslint-disable prettier/prettier */
 /* eslint-disable @typescript-eslint/no-unused-vars */
// import { verify } from 'jsonwebtoken';
// import { NestMiddleware, Injectable, ForbiddenException } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { CollaborateurService } from 'src/collaborateur/collaborateur.service';
// import { Collaborateur } from 'src/collaborateur/entities/collaborateur.entity';
// import { UserRole } from 'src/enum/UserRole';
// import { jwtConstants } from '../constants';

// /** The AuthMiddleware is used to
//  * (1) read the request header bearer token/user access token
//  * (2) decrypt the access token to get the user object
//  */
// export interface AccessTokenPayload {
//   id: number;
//   role: UserRole;
// }

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(private readonly collaborateurService: CollaborateurService) {}

//   async use(req: Request | any, res: Response, next: () => void) {
//     const bearerHeader = req.headers.authorization;
//     const accessToken = bearerHeader && bearerHeader.split(' ')[1];
//     let user;

//     if (!bearerHeader || !accessToken) {
//       return next();
//     }

//     try {
//       //   const { id,role }: AccessTokenPayload = verify(
//       //     accessToken,
//       //     jwtConstants.secret,
//       //   );
//       //   user = await this.collaborateurService.findOneCol(id);
//     } catch (error) {
//       throw new ForbiddenException('Please register or sign in.');
//     }

//     // if (user) {
//     //   req.user = user;
//     // }
//     next();
//   }
// }
