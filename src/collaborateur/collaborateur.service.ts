import { Equipe } from './entities/equipe.entity';
import { UpdateColInput } from './Dto/update.col.input';
import { CreateColInput } from './Dto/create.col.input';
import { Collaborateur } from './entities/collaborateur.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pole } from './entities/pole.entity';
import { CreatePoleInput } from './Dto/create.pole.input';
import { Personne } from 'src/candidat/entities/personne.entity';
import { Cv } from 'src/cv/entities/cv.entity';
import { FilterInput } from './Dto/filter.input';
import { UserRole } from 'src/enum/UserRole';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CollaborateurService {
    constructor(
    @InjectRepository(Collaborateur) 
    private collaborateurRepository: Repository<Collaborateur>,
    @InjectRepository(Equipe) 
    private equipeRepository: Repository<Equipe>,
    @InjectRepository(Pole) 
    private poleRepository: Repository<Pole>,
    @InjectRepository(Personne)
    private personneRepository: Repository<Personne>,
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>){}
    // date1 = new Date('1996-10-13 00:00:00')
    // date2 = new Date('2017-01-25 00:00:00')
    // private readonly users: Collaborateur[]= [
    //     {id:2,nom:"timelli",prenom:"oumayma",cin:1245678,dateNaiss:this.date1,adresse:"Bizerte",tel:20100300,email:"oumayma.timelli@gmail.com",avatar:"oumayma.jpg",cvId:2,telPro:21200500,emailPro:"oumayma.timelli@proxym-it.com",poste:"ingenieur web full stack",salaire:1400,dateEmb:this.date2,nomUtilisateur:"oumaymaTime",motDePasse:"1234",evaluation:3,role:UserRole.COLLABORATEUR}, 
    //     {id:3,nom:"miled",prenom:"nour elhouda",cin:18461635,dateNaiss:this.date1,adresse:"sousse",tel:25100200,email:"nourelhouda.miled@gmail.com",avatar:"nour.jpg",cvId:3,telPro:25600700,emailPro:"nourelhouda.miled@proxym-it.com",poste:"Ressources humaines ",salaire:2200,dateEmb:this.date2,nomUtilisateur:"nourMiled",motDePasse:"1234",evaluation:4,role:UserRole.RH},
    //     {id:4,nom:"hassine",prenom:"bilel",cin:1246541,dateNaiss:this.date1,adresse:"Banane, Monastir",tel:26500600,email:"bilel.hassine@gmail.com",avatar:"bilel.jpg",cvId:4,telPro:28500600,emailPro:"bilel.hassine@proxym-it.com",poste:"responsable pole ESS",salaire:3500,dateEmb:this.date2,nomUtilisateur:"bilelHassine",motDePasse:"1234",evaluation:4,role:UserRole.RP},
    //     {id:5,nom:"jammali",prenom:"nidhal",cin:9451327,dateNaiss:this.date1,adresse:"Sousse",tel:20300100,email:"nidhal.jammali@gmail.com",avatar:"tof.jpg",cvId:5,telPro:20300100,emailPro:"nidhal.jammali@gmail.com",poste:"chef d'equipe PNL",salaire:2500,dateEmb:this.date2,nomUtilisateur:"nidhalJam",motDePasse:"1234",evaluation:4,role:UserRole.TEAMLEADER},
    //     {id:6,nom:"boubou",prenom:"ali",cin:1234654,dateNaiss:this.date1,adresse:"sousse",tel:29900800,email:"ali.boubou@gmail.com",avatar:"man.png",cvId:6,telPro:25900800,emailPro:"ali.boubou@proxym-it.com",poste:"chef d'equipe BEST",salaire:2500,dateEmb:this.date2,nomUtilisateur:"aliBou",motDePasse:"1234",evaluation:4,role:UserRole.TEAMLEADER},
    //     {id:8,nom:"cherif",prenom:"ahmed",cin:8529637,dateNaiss:this.date1,adresse:"sousse",tel:21100100,email:"ahmed.cherif@gmail.com",avatar:"man.png",cvId:8,telPro:25100100,emailPro:"ahmed.cherif@proxym-it.com",poste:"responsable pole Mobile",salaire:3500,dateEmb:this.date2,nomUtilisateur:"ahmedCh",motDePasse:"1234",evaluation:5,role:UserRole.RP},
    //     {id:10,nom:"rassas",prenom:"med amine",cin:12348745,dateNaiss:this.date1,adresse:"centre ville sousse",tel:98453785,email:"med.amine.rassas@gmail.com",avatar:"rassas.jpg",cvId:10,telPro:26100580,emailPro:"med.amine.rassas@proxym-it.com",poste:"developpeur web",salaire:700,dateEmb:this.date2,nomUtilisateur:"amineRass",motDePasse:"1234",evaluation:3,role:UserRole.COLLABORATEUR},
    //     {id:11,nom:"mhiri",prenom:"sadok mourad",cin:12348728,dateNaiss:this.date1,adresse:"hamem sousse",tel:98453285,email:"sadok.mhiri@gmail.com",avatar:"sadok.jpg",cvId:11,telPro:26100680,emailPro:"sadok.mhiri@proxym-it.com",poste:"developpeur mobile",salaire:700,dateEmb:this.date2,nomUtilisateur:"sadokMh",motDePasse:"1234",evaluation:3,role:UserRole.COLLABORATEUR},
    //     {id:12,nom:"abid",prenom:"montassar",cin:94513455,dateNaiss:this.date1,adresse:"sousse",tel:20350150,email:"montassar.abid@gmail.com",avatar:"man.png",cvId:12,telPro:25300150,emailPro:"montassar.abid@proxym-it.com",poste:"chef d'equipe Java",salaire:2500,dateEmb:this.date2,nomUtilisateur:"Monta",motDePasse:"1234",evaluation:4,role:UserRole.TEAMLEADER},
    //     {id:13,nom:"admin",prenom:"super",cin:1111111,dateNaiss:this.date1,adresse:"sousse",tel:20352550,email:"admin@gmail.com",avatar:"admin.png",cvId:13,telPro:25311150,emailPro:"admin@proxym-it.com",poste:"Administrateur",salaire:1000,dateEmb:this.date2,nomUtilisateur:"Admin",motDePasse:"1234",evaluation:5,role:UserRole.ADMIN}]

    /***************Collaborateur*********/

    // async findByUsername(nomUtilisateur: string): Promise<Collaborateur | undefined> {
    //     return this.users.find(user => user.nomUtilisateur === nomUtilisateur);
    //   }

    async findPostes(): Promise<Collaborateur[]> {
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query.select('poste').where('collaborateur.poste <> ""').distinct(true);
        return query.getRawMany();
    }

    async findColByUsername(nomUtilisateur: string):Promise<Collaborateur>{
      const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query.where('collaborateur.nomUtilisateur= :nomUtilisateur',{nomUtilisateur})
        .leftJoinAndSelect('collaborateur.notifications','notifications')
        .leftJoinAndSelect('collaborateur.equipe', 'equipe')
        .leftJoinAndSelect('equipe.pole', 'pole')
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('equipe.teamleader', 'teamleader')
        .leftJoinAndSelect('collaborateur.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('collaborateur.cv','cv')
        .leftJoinAndSelect('cv.skills','skills');
        return query.getOne();
    }

    createToken({ id, nomUtilisateur }: Collaborateur):any {
        return jwt.sign({ id, nomUtilisateur }, 'secret');
      }

    async findAllCols(poleId?):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query
        .leftJoinAndSelect('collaborateur.notifications','notifications')
        .leftJoinAndSelect('collaborateur.equipe', 'equipe')
        .leftJoinAndSelect('equipe.pole', 'pole')
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('equipe.teamleader', 'teamleader')
        .leftJoinAndSelect('collaborateur.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('collaborateur.cv','cv')
        .leftJoinAndSelect('cv.skills','skills')
        .orderBy('collaborateur.nom');
        if(poleId) {
            query.where('pole.id = :poleId', {poleId})
        }
        return query.getMany();
    }

    async findOneCol(id: number):Promise<Collaborateur>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query.where('collaborateur.id= :id',{id})
        .leftJoinAndSelect('collaborateur.notifications','notifications')
        .leftJoinAndSelect('collaborateur.equipe', 'equipe')
        .leftJoinAndSelect('equipe.pole', 'pole')
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('equipe.teamleader', 'teamleader')
        .leftJoinAndSelect('collaborateur.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('collaborateur.cv','cv')
        .leftJoinAndSelect('cv.skills','skills');
        return query.getOne();
    }

    async createCol(createColInput: CreateColInput):Promise<Collaborateur>{
        const newCol=this.collaborateurRepository.create(createColInput);
        return await this.collaborateurRepository.save(newCol);
    }

    async updateCol(id: number, updateColInput: UpdateColInput):Promise<Collaborateur> {
        //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
        const newCol= await this.collaborateurRepository.preload({
          id,
          ...updateColInput
      })
      //et la on va sauvegarder la nv entité
      if(!newCol){//si l id n existe pas
          throw new NotFoundException(`col d'id ${id} n'exsite pas!`);
      }
      return await this.collaborateurRepository.save(newCol);
    }
    
    async removeCol(idCol: number):Promise<boolean> {
        var supp=false;
        const col= await this.findOneCol(idCol);
        console.log("delete col:",col)
        const coltoremove=this.collaborateurRepository.remove(col);
        const cv = await this.cvRepository.findOne({
        where: { id: col.cv.id }
        });
        await this.cvRepository.remove(cv);
        console.log("deleted col:",col)
        console.log("delete cv:",cv)
        if (coltoremove) supp=true;
        return await supp;
    }

    async getFilterCols(selectedPoles?: number[],selectedEquipes?: number[],selectedPoste?: string[],selectedComp?: string[]):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
          console.log("*************")
          if(selectedPoles){
            console.log("pole true")
            query.andWhere('pole.id in (:selectedPoles)', { selectedPoles })
          }
          if(selectedPoste){
            console.log("poste true")
            query.andWhere('collaborateur.poste in (:selectedPoste)',{selectedPoste})
          }
          if(selectedEquipes){
            console.log("equipe true")
            query.andWhere('equipe.id in (:selectedEquipes)', { selectedEquipes })
          }
          if(selectedComp){
            console.log("comp true")
            query.andWhere('skills.nom in (:selectedComp)',{selectedComp})
          }
        query.leftJoinAndSelect('collaborateur.equipe', 'equipe')
        .leftJoinAndSelect('equipe.pole', 'pole')
        .leftJoinAndSelect('pole.rp', 'rp')
        .leftJoinAndSelect('equipe.teamleader', 'teamleader')
        .leftJoinAndSelect('collaborateur.notifications', 'notifications')
        .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
        .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
        .leftJoinAndSelect('collaborateur.cv', 'cv')
        .leftJoinAndSelect('cv.skills','skills')
        .orderBy('collaborateur.nom');
        return query.getMany();
    }

    async getFilteredCols(filter: FilterInput):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        console.log("filter:",filter)
        const valeurs= filter.valeurs;
        const champs= filter.champs;
        query
          .where(':champs in (:...valeurs)', {champs,valeurs})
          .leftJoinAndSelect('collaborateur.equipe', 'equipe')
          .leftJoinAndSelect('equipe.pole', 'pole')
          .printSql();
        console.log("query**********",query)
        return query.getMany();
    }

    async getFilterRole(selectedRoles: UserRole[]):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query
          .where('collaborateur.role in (:selectedRoles)', { selectedRoles })
          .leftJoinAndSelect('collaborateur.equipe', 'equipe')
          .leftJoinAndSelect('equipe.pole', 'pole')
          .leftJoinAndSelect('pole.rp', 'rp')
          .leftJoinAndSelect('equipe.teamleader', 'teamleader')
          .leftJoinAndSelect('collaborateur.notifications', 'notifications')
          .leftJoinAndSelect('collaborateur.cv', 'cv')
          .leftJoinAndSelect('cv.skills','skills')
          .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
          .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
        //   .orderBy('collaborateur.nom');
        return query.getMany();
    }

    async getFilterFormation(selectedNiv: string[], selectedSpec: string[],selectedUniver: string[]):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query
          .where('collaborateur.role in (:selectedRoles)', { selectedUniver })
          .leftJoinAndSelect('collaborateur.equipe', 'equipe')
          .leftJoinAndSelect('equipe.pole', 'pole')
          .leftJoinAndSelect('pole.rp', 'rp')
          .leftJoinAndSelect('equipe.teamleader', 'teamleader')
          .leftJoinAndSelect('collaborateur.notifications', 'notifications')
          .leftJoinAndSelect('collaborateur.cv', 'cv')
          .leftJoinAndSelect('cv.skills','skills')
          .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
          .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
        return query.getMany();
    }

    async findPoleRp(idRP: number):Promise<Pole>{
        const query = this.poleRepository.createQueryBuilder('pole');
        query.where('rp.id= :idRP',{idRP})
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('rp.cv','cv')
        .leftJoinAndSelect('cv.skills','skills')
        .leftJoinAndSelect('pole.equipes','equipes')
        .leftJoinAndSelect('equipes.collaborateurs','collaborateurs')
        return query.getOne();
    }

      /***************Pole*********/
    async findAllPoles():Promise<Pole[]>{
        //return this.poleRepository.find({relations: ['equipes']});
        const query = this.poleRepository.createQueryBuilder('pole');
        query
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('rp.cv','cv')
        .leftJoinAndSelect('cv.skills','skills')
        .leftJoinAndSelect('pole.equipes','equipes')
        .leftJoinAndSelect('equipes.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipes.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .orderBy('pole.nom');
        return query.getMany();
    }

    async findOnePole(id: number):Promise<Pole>{
        //return this.poleRepository.findOneOrFail(idPole,{relations: ['collaborateurs']});
        const query = this.poleRepository.createQueryBuilder('pole');
        query.where('pole.id= :id',{id})
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('rp.cv','cv')
        .leftJoinAndSelect('cv.skills','skills')
        .leftJoinAndSelect('pole.equipes','equipes')
        .leftJoinAndSelect('equipes.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipes.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        return query.getOne();
    }

    async createPole(createPoleInput: CreatePoleInput):Promise<Pole>{
        const newPole=this.poleRepository.create(createPoleInput);
        return this.poleRepository.save(newPole);
    }

      /***************Equipe*********/
    async findAllEquipes():Promise<Equipe[]>{
        //return this.equipeRepository.find({relations: ['collaborateurs']});
        const query = this.equipeRepository.createQueryBuilder('equipe');
        query
        .leftJoinAndSelect('equipe.pole','pole')
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('equipe.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipe.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('teamleader.cv','cv')
        .leftJoinAndSelect('cv.skills','skills')
        .orderBy('equipe.nom');
        return query.getMany();
    }

    async findOneEquipe(id: number):Promise<Equipe>{
        const query = this.equipeRepository.createQueryBuilder('equipe');
        query.where('equipe.id= :id',{id})
        .leftJoinAndSelect('equipe.pole','pole')
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('equipe.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipe.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('teamleader.cv','cv')
        .leftJoinAndSelect('cv.skills','skills')
        return query.getOne();    }

        async findEquipesPoles(idPoles: number[]):Promise<Equipe[]>{
            //return this.equipeRepository.find({relations: ['collaborateurs']});
            const query = this.equipeRepository.createQueryBuilder('equipe');
            query.where('pole.id in (:idPoles) ',{idPoles})
            .leftJoinAndSelect('equipe.pole','pole')
            .leftJoinAndSelect('pole.rp','rp')
            .leftJoinAndSelect('equipe.collaborateurs','collaborateurs')
            .leftJoinAndSelect('equipe.teamleader','teamleader')
            return query.getMany();
        }
}
