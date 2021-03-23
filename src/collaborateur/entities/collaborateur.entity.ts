import { UserRole } from './../../enum/UserRole';
import { Notification } from './../../notification/entities/notification.entity';
import { Equipe } from './equipe.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Cv } from 'src/cv/entities/cv.entity';

@Entity('collaborateur')
@ObjectType()
export class Collaborateur {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field(type => Int)
    tel: number;

    @Column()
    @Field()
    poste: string;

    @Column()
    @Field(type => Int)
    salaire: number;

    @Column({nullable: true})
    @Field({nullable: true})
    dateEmb?: Date;

    @Column({ unique: true })
    @Field()
    nomUtilisateur: string;

    @Column({select: false})
    @Field()
    motDePasse: string;

    @Column({
        type: "set",
        enum: UserRole,
        default: [UserRole.COLABORATEUR]
    })
    @Field(type => [UserRole])
    roles :UserRole[];

    @Column()
    @Field(type => Int,{nullable:true})
    evaluation?: number;

    @ManyToOne(()=>Equipe, equipe=>equipe.collaborateurs)
    @Field(type=> Equipe,{nullable:true})
    equipe? :Equipe;
    @RelationId((collaborateur:Collaborateur)=>collaborateur.equipe)
    equipeId: number;
//     @ManyToOne(type => Recipe)
//   recipe: Recipe;
//   @RelationId((rate: Rate) => rate.recipe)
//   recipeId: number;

    @OneToMany(()=>Notification, notification=>notification.collaborateur)
    @Field(type=>[Notification],{nullable:true})
    notifications?: Notification[];

    @OneToOne(()=>Cv)
    @JoinColumn()
    @Field(type => Cv)
    cv :Cv;


    // @BeforeInsert()
    // async hashPassword(){
    //     this.mot_de_passe = await bcrypt.hash(this.mot_de_passe,10);
    // }

}
