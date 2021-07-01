import { Notification } from './entities/notification.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { Repository } from 'typeorm';
import { Collaborateur } from 'src/collaborateur/entities/collaborateur.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Collaborateur)
    private collaborateurRepository: Repository<Collaborateur>,
  ) {}

  async createNotif(
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    const colId = createNotificationInput.collaborateurId;
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    query.where('collaborateur.id= :colId', { colId });
    const newNotif = this.notificationRepository.create(
      createNotificationInput,
    );
    const col = await query.getOne();
    newNotif.collaborateur = col;
    return this.notificationRepository.save(newNotif);
  }

  async findAllNotif(): Promise<Notification[]> {
    return this.notificationRepository.find({ relations: ['collaborateur'] });
  }

  async findOneNotif(idNotif: number): Promise<Notification> {
    return this.notificationRepository.findOneOrFail(idNotif, {
      relations: ['collaborateur'],
    });
  }

  async findNotifCol(idCol: number): Promise<Notification[]> {
    const query = this.notificationRepository.createQueryBuilder(
      'notification',
    );
    query
      .where('collaborateur.id= :idCol', { idCol })
      .leftJoinAndSelect('notification.collaborateur', 'collaborateur')
      .orderBy('notification.date', 'DESC');
    return query.getMany();
  }

  /*async updateNotif(id: number, updateNotifInput: UpdateNotificationInput):Promise<Notification> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newNotif= await this.notificationRepository.preload({
      id,
      ...updateNotifInput
  })
  //et la on va sauvegarder la nv entité
  if(!newNotif){//si l id n existe pas
      throw new NotFoundException(`notif d'id ${id} n'exsite pas!`);
  }
  return await this.notificationRepository.save(newNotif);
  }*/

  async removeNotif(idNotif: number): Promise<boolean> {
    let supp = false;
    const notiftoremove = await this.findOneNotif(idNotif);
    this.notificationRepository.remove(notiftoremove);
    if (notiftoremove) supp = true;
    return await supp;
  }
}
