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
import { CandidatModule } from './candidat/candidat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'analyse cv',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    /*GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/notification/schemaNotif.gql',
      include: [NotificationModule],
      playground: true,
    }),*/
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(),'schema.gql'),
    }),
    CollaborateurModule,
    NotificationModule,
    EntretienModule,
    CvModule,
    CandidatModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
