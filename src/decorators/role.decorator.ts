/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from './../enum/UserRole';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
