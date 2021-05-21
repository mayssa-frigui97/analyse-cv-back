import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CollaborateurService } from 'src/collaborateur/collaborateur.service';
import { UserRole } from 'src/enum/UserRole';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collaborateur } from './../collaborateur/entities/collaborateur.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { error } from 'console';

@ObjectType()
export class Connexion{
  @Field()
  public access_token: string
  @Field(type => Collaborateur)
  public user: Collaborateur
}

@Injectable()
export class AuthService {
  // Users: Collaborateur[]= [
  //     {id:2,nom:"timelli",prenom:"oumayma",cin:1245678,dateNaiss:"1996-10-13 00:00:00",adresse:"Bizerte",tel:20100300,email:"oumayma.timelli@gmail.com",avatar:"oumayma.jpg",cvId:2,telPro:21200500,emailPro:"oumayma.timelli@proxym-it.com",poste:"ingenieur web full stack",salaire:1400,dateEmb:"2020-06-05 00:00:00",nomUtilisateur:"oumaymaTime",motDePasse:"1234",evaluation:3,role:UserRole.COLLABORATEUR},
  //     {id:3,nom:"miled",prenom:"nour elhouda",cin:18461635,dateNaiss:"1983-01-25 00:00:00",adresse:"sousse",tel:25100200,email:"nourelhouda.miled@gmail.com",avatar:"nour.jpg",cvId:3,telPro:25600700,emailPro:"nourelhouda.miled@proxym-it.com",poste:"Ressources humaines ",salaire:2200,dateEmb:"2017-01-22 00:00:00",nomUtilisateur:"nourMiled",motDePasse:"1234",evaluation:4,role:UserRole.RH},
  //     {id:4,nom:"hassine",prenom:"bilel",cin:1246541,dateNaiss:"1985-04-22 00:00:00",adresse:"Banane, Monastir",tel:26500600,email:"bilel.hassine@gmail.com",avatar:"bilel.jpg",cvId:4,telPro:28500600,emailPro:"bilel.hassine@proxym-it.com",poste:"responsable pole ESS",salaire:3500,dateEmb:"2015-04-01 00:00:00",nomUtilisateur:"bilelHassine",motDePasse:"1234",evaluation:4,role:UserRole.RP},
  //     {id:5,nom:"jammali",prenom:"nidhal",cin:9451327,dateNaiss:"1990-01-26 00:00:00",adresse:"Sousse",tel:20300100,email:"nidhal.jammali@gmail.com",avatar:"tof.jpg",cvId:5,telPro:20300100,emailPro:"nidhal.jammali@gmail.com",poste:"chef d'equipe PNL",salaire:2500,dateEmb:"2017-01-22 00:00:00",nomUtilisateur:"nidhalJam",motDePasse:"1234",evaluation:4,role:UserRole.TEAMLEADER},
  //     {id:6,nom:"boubou",prenom:"ali",cin:1234654,dateNaiss:"1993-04-22 00:00:00",adresse:"sousse",tel:29900800,email:"ali.boubou@gmail.com",avatar:"man.png",cvId:6,telPro:25900800,emailPro:"ali.boubou@proxym-it.com",poste:"chef d'equipe BEST",salaire:2500,dateEmb:"2018-04-01 00:00:00",nomUtilisateur:"aliBou",motDePasse:"1234",evaluation:4,role:UserRole.TEAMLEADER},
  //     {id:8,nom:"cherif",prenom:"ahmed",cin:8529637,dateNaiss:"1993-04-03 00:00:00",adresse:"sousse",tel:21100100,email:"ahmed.cherif@gmail.com",avatar:"man.png",cvId:8,telPro:25100100,emailPro:"ahmed.cherif@proxym-it.com",poste:"responsable pole Mobile",salaire:3500,dateEmb:"2015-03-01 00:00:00",nomUtilisateur:"ahmedCh",motDePasse:"1234",evaluation:5,role:UserRole.RP},
  //     {id:10,nom:"rassas",prenom:"med amine",cin:12348745,dateNaiss:"1996-09-17 00:00:00",adresse:"centre ville sousse",tel:98453785,email:"med.amine.rassas@gmail.com",avatar:"rassas.jpg",cvId:10,telPro:26100580,emailPro:"med.amine.rassas@proxym-it.com",poste:"developpeur web",salaire:700,dateEmb:"2019-06-01 00:00:00",nomUtilisateur:"amineRass",motDePasse:"1234",evaluation:3,role:UserRole.COLLABORATEUR},
  //     {id:11,nom:"mhiri",prenom:"sadok mourad",cin:12348728,dateNaiss:"1996-11-17 00:00:00",adresse:"hamem sousse",tel:98453285,email:"sadok.mhiri@gmail.com",avatar:"sadok.jpg",cvId:11,telPro:26100680,emailPro:"sadok.mhiri@proxym-it.com",poste:"developpeur mobile",salaire:700,dateEmb:"2019-09-01 00:00:00",nomUtilisateur:"sadokMh",motDePasse:"1234",evaluation:3,role:UserRole.COLLABORATEUR},
  //     {id:12,nom:"abid",prenom:"montassar",cin:94513455,dateNaiss:"1993-04-26 00:00:00",adresse:"sousse",tel:20350150,email:"montassar.abid@gmail.com",avatar:"man.png",cvId:12,telPro:25300150,emailPro:"montassar.abid@proxym-it.com",poste:"chef d'equipe Java",salaire:2500,dateEmb:"2017-03-25 00:00:00",nomUtilisateur:"Monta",motDePasse:"1234",evaluation:4,role:UserRole.TEAMLEADER},
  //     {id:13,nom:"admin",prenom:"super",cin:1111111,dateNaiss:"1994-04-26 00:00:00",adresse:"sousse",tel:20352550,email:"admin@gmail.com",avatar:"admin.png",cvId:13,telPro:25311150,emailPro:"admin@proxym-it.com",poste:"Administrateur",salaire:1000,dateEmb:"2017-03-25 00:00:00",nomUtilisateur:"Admin",motDePasse:"1234",evaluation:5,role:UserRole.ADMIN}]

  constructor(
    private readonly collaborateurService: CollaborateurService,
    private readonly jwtService: JwtService,
    @InjectRepository(Collaborateur)
    private collaborateurRepository: Repository<Collaborateur>,
  ) {}

  async validate(
    nomUtilisateur: string,
    motDePasse: string,
  ): Promise<Collaborateur | null> {
    const user = await this.collaborateurService.findByUsername(nomUtilisateur);

    if (!user) {
      return null;
    }

    const passwordIsValid = motDePasse === user.motDePasse;
    return passwordIsValid ? user : null;
  }

  // login(user: Collaborateur): { access_token: string } {
  //     const payload = {
  //         nomUtilisateur: user.nomUtilisateur,
  //         id: user.id
  //     }

  //     return {
  //         access_token: this.jwtService.sign(payload),
  //     }
  // }

  verify(token: string): Promise<Collaborateur> {
    const decoded = this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });

    const user = this.collaborateurService.findByUsername(
      decoded.nomUtilisateur,
    );

    if (!user) {
      throw new Error('Unable to get the user from decoded token.');
    }

    return user;
  }

  async login({ nomUtilisateur, motDePasse }): Promise<Connexion|GraphQLError> {
    try {
      // const person = await this.collaborateurService.findByUsername(nomUtilisateur);
      const person = await this.collaborateurRepository
      .createQueryBuilder('collaborateur')
      .addSelect('collaborateur.motDePasse')
      .where('collaborateur.nomUtilisateur = :nomUtilisateur', { nomUtilisateur })
      .getOne();
      console.log("person:",person)
      if (!person) {
        // throw new NotFoundException('nom utilisateur erroné');
        console.log('nom utilisateur erroné');
        return new GraphQLError('nom utilisateur erroné');
      }
      person.motDePasse = await bcrypt.hash(person.motDePasse,10);
    //   const isSame =await motDePasse ==res.motDePasse
      const isSame = await bcrypt.compare(motDePasse, person.motDePasse);
      console.log("issame:",isSame)
      return person && (isSame)
        ? this.getToken(nomUtilisateur, person.id).then((result) => result)
        : new GraphQLError('nom utilisateur ou mot de passe erroné');
    } catch (err) {
      console.error(err);
    }
    // try {
    // const person = await this.collaborateurRepository
    //   .createQueryBuilder('collaborateur')
    //   .addSelect('collaborateur.motDePasse')
    //   .where('collaborateur.nomUtilisateur = :nomUtilisateur', { nomUtilisateur })
    //   .getOne();
    // si not Auth je déclenche erreur
    // if (!person) {
    //   // throw new NotFoundException('nom utilisateur erroné');
    //   throw new GraphQLError('nom utilisateur erroné');
    // }
    // person.motDePasse = await bcrypt.hash(person.motDePasse,10);
    //si ui verifier si le mdp est correct
    // const isSame = await bcrypt.compare(motDePasse, person.motDePasse);
    // if (isSame) {
    //   const payload = {
    //     id: person.id,
    //     nomUtilisateur: person.nomUtilisateur,
    //   };
      // return person && (isSame)
      //   ? this.getToken(nomUtilisateur, person.id).then((result) => result)
      //   : new GraphQLError('nom utilisateur ou mot de passe erroné');
    //   user = person;
    //   const jwt = this.jwtService.sign(payload);
    // //   delete user.motDePasse;
    //   console.log('here user auth:', person);
    //   return {
    //     "access_token": jwt,
    //     "user": person
    // };
    // }
    // sinon je déclenche une erreur
    // else {
    //   throw new GraphQLError('nom utilisateur ou mot de passe erroné');
    // }
// }
//     catch (err) {
//           console.error(err);
//         }
  }


  async getToken(nomUtilisateur, id): Promise<Connexion> {
    try {
      const person = await this.collaborateurService.findColByUsername(nomUtilisateur);
      const token = await this.jwtService.signAsync({ nomUtilisateur, id });
      console.log('username:', nomUtilisateur, 'id:', id, 'token:', token);
      return {
        "access_token": token,
        "user": person
    };
    } catch (err) {
      console.error(err);
    }
  }
}
