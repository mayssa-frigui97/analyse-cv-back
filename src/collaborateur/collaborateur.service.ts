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
        // const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        // query.leftJoinAndSelect('collaborateur.notifications','notifications')
        // .leftJoinAndSelect('collaborateur.equipe', 'equipe')
        // .leftJoinAndSelect('equipe.pole', 'pole')
        // .leftJoinAndSelect('equipe.teamleader', 'teamleader')
        // .leftJoinAndSelect('collaborateur.candidatures','candidatures')
        // .leftJoinAndSelect('candidatures.entretiens','entretiens')
        // .leftJoinAndSelect('collaborateur.cv','cv')
        // .leftJoinAndSelect('cv.langues','langues')
        // .leftJoinAndSelect('cv.formations','formations')
        // .leftJoinAndSelect('cv.experiences','experiences')
        // .leftJoinAndSelect('cv.competences','competences')
        // .leftJoinAndSelect('cv.certificats','certificats')
        // .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives');
        // query.getOne();
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
        const coltoremove=this.collaborateurRepository.remove(col);
        const personne = await this.personneRepository.findOne(idCol);
        const cv = await this.cvRepository.findOne({
        where: { id: col.cv.id }
        });
        await this.personneRepository.remove(personne);
        console.log("delete personne:",personne)
        await this.cvRepository.remove(cv);
        console.log("delete cv:",cv.id)
        if (coltoremove) supp=true;
        return await supp;
    }

    async getFilterPole(selectedPoles: number[]):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
            console.log("type:", selectedPoles)
            query.where('pole.id in (:selectedPoles)',{selectedPoles})
                .leftJoinAndSelect('collaborateur.equipe', 'equipe')
                .leftJoinAndSelect('equipe.pole', 'pole')
                .leftJoinAndSelect('equipe.teamleader', 'teamleader')
                .leftJoinAndSelect('collaborateur.notifications','notifications')
                .leftJoinAndSelect('collaborateur.cv','cv')
                .leftJoinAndSelect('collaborateur.candidatures','candidatures')
                .leftJoinAndSelect('candidatures.entretiens','entretiens')
                .leftJoinAndSelect('cv.langues','langues')
                .leftJoinAndSelect('cv.formations','formations')
                .leftJoinAndSelect('cv.experiences','experiences')
                .leftJoinAndSelect('cv.competences','competences')
                .leftJoinAndSelect('cv.certificats','certificats')
                .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives');
        return query.getMany();
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
        .leftJoinAndSelect('collaborateurs.candidatures','candidatures')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
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
        .leftJoinAndSelect('equipe.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipe.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.cv','cv')
        .leftJoinAndSelect('collaborateurs.candidatures','candidatures')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        return query.getMany();
    }

    async findOneEquipe(id: number):Promise<Equipe>{
        const query = this.equipeRepository.createQueryBuilder('equipe');
        query.where('equipe.id= :id',{id})
        .leftJoinAndSelect('equipe.pole','pole')
        .leftJoinAndSelect('equipe.collaborateurs','collaborateurs')
        .leftJoinAndSelect('equipe.teamleader','teamleader')
        .leftJoinAndSelect('collaborateurs.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('collaborateurs.cv','cv')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        return query.getOne();    }
}
