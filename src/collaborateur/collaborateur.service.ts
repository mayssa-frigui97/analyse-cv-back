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
import { UserPermission } from 'src/enum/UserPermission';

//require the Elasticsearch librray
const elasticsearch = require('elasticsearch');
// instantiate an Elasticsearch client
const client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});

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
    

      /***************Requette ElasticSearch*********/

  async search(mot : String): Promise<Collaborateur[]> {
    let cols : Collaborateur[]=[];
    let index = "cv";
    let body = {
      query: {
        query_string: {
            query: mot
        }
      }
    };
    console.log(`résultat des personnes recherchées pour :'${body.query.query_string.query}'`);
    await client.search({index: index, body: body})
    .then(results => {
      console.log(`found ${results.hits.total.value} items in ${results.took}ms`);
      if (results.hits.total > 0) console.log(`returned person name:`);
      results.hits.hits.forEach((hit, index) => {
      console.log(`\t${hit._id} - ${hit._source.nom} (score: ${hit._score})`);
      cols.push(hit._source);
      });
    })
    .catch(console.error);
    if(cols !== []){
      console.log("résultat trouvée!!");
      return cols;
    }
    console.log("pas de résultat trouvée!!")
    return [];
  }

  async createData(): Promise<boolean> {
    this.findAllCols().then((cols) => {
      cols.forEach((col) => {
        var str = col.id.toString();
        let collaborateur = JSON.stringify(col);
        client.index({
          index: 'cv',
          id: str,
          body: collaborateur
        }, function(err, resp, status) {
              console.log(resp);
           });
           console.log("**person:",col.nom ,"is pushed");
      });
      console.log("Successfully imported %s", cols.length, " persons");
    })

    const { body: count } = await client.count({ index: 'cv' })
    console.log("count: ",count);
    return true;
  }

  async createIndex(): Promise<boolean> {
    client.indices.create({
        index: 'cv'
    }, function(error, response, status) {
        if (error) {
            console.log(error);
        } else {
            console.log("created a new index", response);
        }
    });
    return true;
  }

    /***************Collaborateur*********/

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
        .leftJoinAndSelect('cv.competences','competences');
        return query.getOne();
    }

    createToken({ id, nomUtilisateur }: Collaborateur):any {
        return jwt.sign({ id, nomUtilisateur }, 'secret');
      }

    async findAllCols(poleId?):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query
        // .leftJoinAndSelect('collaborateur.notifications','notifications')
        .leftJoinAndSelect('collaborateur.equipe', 'equipe')
        .leftJoinAndSelect('equipe.pole', 'pole')
        // .leftJoinAndSelect('pole.rp','rp')
        // .leftJoinAndSelect('equipe.teamleader', 'teamleader')
        // .leftJoinAndSelect('collaborateur.candidatures','candidatures')
        // .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('collaborateur.cv','cv')
        .leftJoinAndSelect('cv.competences','competences')
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
        .leftJoinAndSelect('cv.competences','competences');
        return query.getOne();
    }

    async createCol(createColInput: CreateColInput):Promise<Collaborateur>{
        const newCol=this.collaborateurRepository.create(createColInput);
        let equipeId=createColInput.equipeId;
        const query = this.equipeRepository.createQueryBuilder('equipe');
        query.where('equipe.id= :equipeId',{equipeId})
        query.getOne().then(equipe=> newCol.equipe=equipe);
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
            query.andWhere('competences.nom in (:selectedComp)',{selectedComp})
          }
        query.leftJoinAndSelect('collaborateur.equipe', 'equipe')
        .leftJoinAndSelect('equipe.pole', 'pole')
        .leftJoinAndSelect('pole.rp', 'rp')
        .leftJoinAndSelect('equipe.teamleader', 'teamleader')
        .leftJoinAndSelect('collaborateur.notifications', 'notifications')
        .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
        .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
        .leftJoinAndSelect('collaborateur.cv', 'cv')
        .leftJoinAndSelect('cv.competences','competences')
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

    async getFilterUsers(selectedRoles: UserRole[]):Promise<Collaborateur[]>{
        const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        if(selectedRoles){
          query.where('collaborateur.role in (:selectedRoles)', { selectedRoles })
        }
          query.leftJoinAndSelect('collaborateur.equipe', 'equipe')
          .leftJoinAndSelect('equipe.pole', 'pole')
          .leftJoinAndSelect('pole.rp', 'rp')
          .leftJoinAndSelect('equipe.teamleader', 'teamleader')
          .leftJoinAndSelect('collaborateur.notifications', 'notifications')
          .leftJoinAndSelect('collaborateur.cv', 'cv')
          .leftJoinAndSelect('cv.competences','competences')
          .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
          .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
          .orderBy('collaborateur.nom');
        return query.getMany();
    }
    async findPoleRp(idRP: number):Promise<Pole>{
        const query = this.poleRepository.createQueryBuilder('pole');
        query.where('rp.id= :idRP',{idRP})
        .leftJoinAndSelect('pole.rp','rp')
        .leftJoinAndSelect('rp.cv','cv')
        .leftJoinAndSelect('cv.competences','competences')
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
        .leftJoinAndSelect('cv.competences','competences')
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
        .leftJoinAndSelect('cv.competences','competences')
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
        .leftJoinAndSelect('cv.competences','competences')
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
        .leftJoinAndSelect('cv.competences','competences')
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

    async findRoles():Promise<Collaborateur[]>{
      const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query.select('role').distinct(true);
        return query.getRawMany();
    }

    async findPermissions():Promise<Collaborateur[]>{
      const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
        query.select('permission').distinct(true);
        return query.getRawMany();
    }

}
