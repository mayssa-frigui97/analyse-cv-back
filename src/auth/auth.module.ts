import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { CollaborateurModule } from './../collaborateur/collaborateur.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborateur } from './../collaborateur/entities/collaborateur.entity';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '36000000000s' },
    }),
    CollaborateurModule,
    TypeOrmModule.forFeature([Collaborateur, RefreshToken]),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [JwtModule, AuthModule],
})
export class AuthModule {}
