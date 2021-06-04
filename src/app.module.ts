import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollaborateurModule } from './collaborateur/collaborateur.module';
import { NotificationModule } from './notification/notification.module';
import { EntretienModule } from './entretien/entretien.module';
import { CvModule } from './cv/cv.module';
import { AuthModule } from './auth/auth.module';
import { PersonneModule } from './candidat/personne.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'analyse des cvs',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(),'schema.gql'),
      uploads: true,
      context: req => ({ req })
    }),
    CollaborateurModule,
    NotificationModule,
    EntretienModule,
    CvModule,
    PersonneModule,
    AuthModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
