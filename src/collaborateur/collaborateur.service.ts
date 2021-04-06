import { Equipe } from './entities/equipe.entity';
import { UpdateColInput } from './Dto/update.col.input';
import { CreateColInput } from './Dto/create.col.input';
import { Collaborateur } from './entities/collaborateur.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pole } from './entities/pole.entity';
import { CreatePoleInput } from './Dto/create.pole.input';

@Injectable()
export class CollaborateurService {
    constructor(
    @InjectRepository(Collaborateur) 
    private collaborateurRepository: Repository<Collaborateur>,
    @InjectRepository(Equipe) 
    private equipeRepository: Repository<Equipe>,
    @InjectRepository(Pole) 
    private poleRepository: Repository<Pole>){}

    /***************Collaborateur*********/
    async findAllCol(poleId):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query
        .leftJoinAndSelect('collaborateur.equipe', 'equipe')
        .leftJoinAndSelect('equipe.pole', 'pole')
        .leftJoinAndSelect('equipe.teamleader', 'teamleader')
        .leftJoinAndSelect('collaborateur.notifications','notifications')
        .leftJoinAndSelect('collaborateur.cv','cv')
        .leftJoinAndSelect('cv.candidat','candidat')
        .leftJoinAndSelect('cv.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives');
        if(poleId) {
            query.where('pole.id = :poleId', {poleId})
        }
        return query.getMany();
        //return this.collaborateurRepository.find({relations: ['pole']});
    }

    async findOneCol(id: number):Promise<Collaborateur>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query.where('collaborateur.id= :id',{id})
        .leftJoinAndSelect('collaborateur.equipe', 'equipe')
        .leftJoinAndSelect('equipe.pole', 'pole')
        .leftJoinAndSelect('equipe.teamleader', 'teamleader')
        .leftJoinAndSelect('collaborateur.notifications','notifications')
        .leftJoinAndSelect('collaborateur.cv','cv')
        .leftJoinAndSelect('cv.candidat','candidat')
        .leftJoinAndSelect('cv.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
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
        return this.collaborateurRepository.save(newCol);
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
        const coltoremove= await this.findOneCol(idCol);
        this.collaborateurRepository.remove(coltoremove);
        if (coltoremove) supp=true;
        return await supp;
      }

      /***************Pole*********/
    async findAllPoles():Promise<Pole[]>{
        //return this.poleRepository.find({relations: ['equipes']});
        const query = this.poleRepository.createQueryBuilder('pole');
        query
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('pole.equipes','equipes')
        .leftJoinAndSelect('equipes.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipes.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.cv','cv')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        .leftJoinAndSelect('cv.candidat','candidat')
        .leftJoinAndSelect('cv.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        return query.getMany();
    }

    async findOnePole(id: number):Promise<Pole>{
        //return this.poleRepository.findOneOrFail(idPole,{relations: ['collaborateurs']});
        const query = this.poleRepository.createQueryBuilder('pole');
        query.where('pole.id= :id',{id})
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('pole.equipes','equipes')
        .leftJoinAndSelect('equipes.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipes.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.cv','cv')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        .leftJoinAndSelect('cv.candidat','candidat')
        .leftJoinAndSelect('cv.candidatures','candidatures')
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
        .leftJoinAndSelect('equipe.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipe.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.cv','cv')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        .leftJoinAndSelect('cv.candidat','candidat')
        .leftJoinAndSelect('cv.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        return query.getMany();
    }

    async findOneEquipe(id: number):Promise<Equipe>{
        const query = this.equipeRepository.createQueryBuilder('equipe');
        query.where('equipe.id= :id',{id})
        .leftJoinAndSelect('equipe.pole','pole')
        .leftJoinAndSelect('equipe.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipe.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.cv','cv')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        .leftJoinAndSelect('cv.candidat','candidat')
        .leftJoinAndSelect('cv.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        return query.getOne();    }
}
