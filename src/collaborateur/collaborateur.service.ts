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

    /***************Collaborateur*********/
    async findAllCol(poleId):Promise<Collaborateur[]>{
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
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        .orderBy('collaborateur.prenom');
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
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives');
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
        const personne = await this.personneRepository.findOne(idCol);
        const cv = await this.cvRepository.findOne({
        where: { id: col.cv.id }
        });
        await this.personneRepository.remove(personne);
        console.log("delete personne:",personne)
        await this.cvRepository.remove(cv);
        console.log("deleted col:",col)
        console.log("delete cv:",cv.id)
        if (coltoremove) supp=true;
        return await supp;
    }

    async getFilterCols(selectedPoles?: number[],selectedEquipes?: number[],selectedNiv?: string[], selectedSpec?: string[],selectedUniver?: string[],selectedPoste?: string[],selectedComp?: string[]):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query
          .where('pole.id in (:selectedPoles)', { selectedPoles })
          .orWhere('equipe.id in (:selectedEquipes)', { selectedEquipes })
          .orWhere('cv.posteAct in (:selectedPoste)',{selectedPoste})
          .orWhere('formations.universite in (:selectedUniver)', { selectedUniver })
          .orWhere('formations.niveau in (:selectedNiv)', { selectedNiv })
          .orWhere('formations.specialite in (:selectedSpec)',{selectedSpec})
          .orWhere('competences.nom in (:selectedComp)',{selectedComp})
          .leftJoinAndSelect('collaborateur.equipe', 'equipe')
          .leftJoinAndSelect('equipe.pole', 'pole')
          .leftJoinAndSelect('pole.rp', 'rp')
          .leftJoinAndSelect('equipe.teamleader', 'teamleader')
          .leftJoinAndSelect('collaborateur.notifications', 'notifications')
          .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
          .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
          .leftJoinAndSelect('collaborateur.cv', 'cv')
          .leftJoinAndSelect('cv.langues', 'langues')
          .leftJoinAndSelect('cv.formations', 'formations')
          .leftJoinAndSelect('cv.experiences', 'experiences')
          .leftJoinAndSelect('cv.competences', 'competences')
          .leftJoinAndSelect('cv.certificats', 'certificats')
          .leftJoinAndSelect('cv.activiteAssociatives', 'activiteAssociatives')
          .orderBy('collaborateur.prenom');
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
          .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
          .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
          .leftJoinAndSelect('cv.langues', 'langues')
          .leftJoinAndSelect('cv.formations', 'formations')
          .leftJoinAndSelect('cv.experiences', 'experiences')
          .leftJoinAndSelect('cv.competences', 'competences')
          .leftJoinAndSelect('cv.certificats', 'certificats')
          .leftJoinAndSelect('cv.activiteAssociatives', 'activiteAssociatives');
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
          .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
          .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
          .leftJoinAndSelect('cv.langues', 'langues')
          .leftJoinAndSelect('cv.formations', 'formations')
          .leftJoinAndSelect('cv.experiences', 'experiences')
          .leftJoinAndSelect('cv.competences', 'competences')
          .leftJoinAndSelect('cv.certificats', 'certificats')
          .leftJoinAndSelect('cv.activiteAssociatives', 'activiteAssociatives');
        return query.getMany();
    }

    async findPoleRp(idRP: number):Promise<Pole>{
        const query = this.poleRepository.createQueryBuilder('pole');
        query.where('rp.id= :idRP',{idRP})
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('rp.cv','cv')
        .leftJoinAndSelect('pole.equipes','equipes')
        .leftJoinAndSelect('equipes.collaborateurs','collaborateurs')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        return query.getOne();
    }

      /***************Pole*********/
    async findAllPoles():Promise<Pole[]>{
        //return this.poleRepository.find({relations: ['equipes']});
        const query = this.poleRepository.createQueryBuilder('pole');
        query
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('rp.cv','cv')
        .leftJoinAndSelect('pole.equipes','equipes')
        .leftJoinAndSelect('equipes.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipes.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        return query.getMany();
    }

    async findOnePole(id: number):Promise<Pole>{
        //return this.poleRepository.findOneOrFail(idPole,{relations: ['collaborateurs']});
        const query = this.poleRepository.createQueryBuilder('pole');
        query.where('pole.id= :id',{id})
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('rp.cv','cv')
        .leftJoinAndSelect('pole.equipes','equipes')
        .leftJoinAndSelect('equipes.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipes.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.candidatures','candidatures')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
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
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
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
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
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
