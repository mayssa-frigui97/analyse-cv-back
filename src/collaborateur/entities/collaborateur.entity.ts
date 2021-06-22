import { UserRole } from './../../enum/UserRole';
import { Notification } from './../../notification/entities/notification.entity';
import { Equipe } from './equipe.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Personne } from '../../candidat/entities/personne.entity';
import { RefreshToken } from './../../auth/entities/refresh-token.entity';

// @ChildEntity('collaborateur')
@Entity('collaborateur')
@ObjectType()
export class Collaborateur extends Personne {
  // @PrimaryGeneratedColumn()
  // @Field(type => Int)
  // id:number;
  @Index({ unique: true })
  @Column()
  @Field((type) => Int)
  cin: number;

  @Column()
  @Field((type) => Int)
  telPro: number;

  @Column()
  @IsEmail()
  @Field()
  emailPro: string;

  @Column()
  @Field()
  poste: string;

  @Column()
  @Field((type) => Int)
  salaire: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dateEmb?: Date;

  @Column({
    unique: true,
    type: 'varchar',
    nullable: false,
  })
  @Field()
  @MaxLength(20, {
    message: 'Le nom utilisateur doit avoir au minimum 20 caractéres !',
  })
  @MinLength(4, {
    message: 'Le nom utilisateur doit avoir au minimum 4 caractéres !',
  })
  nomUtilisateur: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COLLABORATEUR,
  })
  @Field((type) => UserRole)
  role: UserRole;

  @Column()
  @Field((type) => Int, { nullable: true })
  evaluation?: number;

  @ManyToOne(() => Equipe, (equipe) => equipe.collaborateurs)
  @IsOptional()
  @Field((type) => Equipe, { nullable: true })
  equipe?: Equipe;

  @OneToMany(() => Notification, (notification) => notification.collaborateur)
  @Field((type) => [Notification], { nullable: true })
  notifications?: Notification[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];
}
