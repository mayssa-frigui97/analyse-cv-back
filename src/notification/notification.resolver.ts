import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => Notification)
  createNotif(
    @Args('createNotifInput') createNotifInput: CreateNotificationInput,
  ) {
    return this.notificationService.createNotif(createNotifInput);
  }

  @Query(() => [Notification], { name: 'findnotifs' })
  findAll() {
    return this.notificationService.findAllNotif();
  }

  @Query(() => Notification, { name: 'findnotif' })
  findOne(@Args('idNotif', { type: () => Int }) idNotif: number) {
    return this.notificationService.findOneNotif(idNotif);
  }

  @Query(() => [Notification])
  findNotifCol(@Args('idCol', { type: () => Int }) idCol: number) {
    return this.notificationService.findNotifCol(idCol);
  }

  @Mutation(() => Boolean)
  removeNotif(@Args('idNotif', { type: () => Int }) idNotif: number) {
    const supp = this.notificationService.removeNotif(idNotif);
    return supp;
  }

  @Mutation(() => Notification)
  updateNotif(
    @Args('idNotif', { type: () => Int }) idNotif: number,
    @Args('lu', { type: () => Boolean }) lu: boolean,
  ) {
    return this.notificationService.updateNotif(idNotif, lu);
  }
}
