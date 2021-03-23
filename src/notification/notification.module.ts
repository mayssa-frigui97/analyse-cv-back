import { join } from 'path';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    /*GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(),'schemas/schemaNotif.gql'),
    }),*/
  ],
  providers: [NotificationResolver, NotificationService]
})
export class NotificationModule {}
