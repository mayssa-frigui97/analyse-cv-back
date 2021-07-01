import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { Collaborateur } from 'src/collaborateur/entities/collaborateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Collaborateur])],
  providers: [NotificationResolver, NotificationService],
})
export class NotificationModule {}
