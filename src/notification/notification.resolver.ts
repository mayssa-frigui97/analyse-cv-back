import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => Notification)
  CreateNotif(@Args('createNotifInput') createNotifInput: CreateNotificationInput) {
    return this.notificationService.createNotif(createNotifInput);
  }

  @Query(() => [Notification], { name: 'Findnotifs' })
  FindAll() {
    return this.notificationService.findAllNotif();
  }

  @Query(() => Notification, { name: 'findnotif' })
  FindOne(@Args('idNotif', { type: () => Int }) idNotif: number) {
    return this.notificationService.findOneNotif(idNotif);
  }

  /*@Mutation(() => Notification)
  UpdateNotif(@Args('idNotif', { type: () => Int }) id: number, 
  @Args('updateNotificationInput') updateNotificationInput: UpdateNotificationInput) {
    return this.notificationService.updateNotif(id, updateNotificationInput);
  }

  @Mutation(() => Boolean)
  RemoveNotif(@Args('idNotif', { type: () => Int }) idNotif: number){
    var supp=this.notificationService.removeNotif(idNotif);
    return supp;
  }*/
}
