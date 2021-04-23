import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { LdapStrategy } from './strategies/ldap.strategy';
import { CollaborateurModule } from 'src/collaborateur/collaborateur.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborateur } from './../collaborateur/entities/collaborateur.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'ldap' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' }
    }),
    CollaborateurModule,
    TypeOrmModule.forFeature([Collaborateur])
  ],
  providers: [AuthService, AuthResolver,LdapStrategy,JwtStrategy],
  exports: [PassportModule.register({ defaultStrategy: 'ldap' }),JwtModule,AuthModule]
})
export class AuthModule {}
