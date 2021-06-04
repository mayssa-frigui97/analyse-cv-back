import { InjectRepository } from '@nestjs/typeorm';
import { Candidature } from './entities/candidature.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cv } from '../cv/entities/cv.entity';
import { Personne } from './entities/personne.entity';
import { CreatePersonneInput } from 'src/Candidat/dto/create-personne.input';
import { UpdatePersonneInput } from './dto/update-personne.input';

//require the Elasticsearch librray
const elasticsearch = require('elasticsearch');
// instantiate an Elasticsearch client
const client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});

@Injectable()
export class PersonneService {
  constructor(
    @InjectRepository(Candidature)
    private candidatureRepository: Repository<Candidature>,
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(Personne)
    private personneRepository: Repository<Personne>
  ) {}

  /***************Requette ElasticSearch*********/

  async search(mot : string): Promise<Personne[]> {
    let candidats : Personne[]=[];
    let index = "cvs";
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
      candidats.push(hit._source);
      });
    })
    .catch(console.error);
    if(candidats !== []){
      console.log("résultat trouvée!!");
      return candidats;
    }
    console.log("pas de résultat trouvée!!")
    return [];
  }

  // async searchFormation(formation:string): Promise<Personne[]> {
  //   let candidats : Personne[]=[];
  //   let index = "cvs";
  //   let body;
  //   if(formation == "Licence"){
  //     body = {
  //       query: {
  //         bool: {
  //           must: [
  //             {
  //               query_string: {
  //                 fields: ['cv.formations', 'cv.experiences'],
  //                 query: 'Licence licence',
  //               },
  //             },
  //           ],
  //           must_not: [
  //             {
  //               query_string: {
  //                 fields: ['cv.formations', 'cv.experiences'],
  //                 query: "ingénieur d'ingénieur Master master ingénieurie d'ingénieurs",
  //               },
  //             }
  //           ]
  //         },
  //       },
  //     };
  //   }
  //   else if (formation == "Master"){
  //     body = {
  //       query: {
  //         bool: {
  //           must: [
  //             {
  //               query_string: {
  //                 fields : ["cv.formations","cv.experiences"],
  //                 query : "master Master"
  //               },
  //             },
  //           ],
  //           must_not: [
  //             {
  //               query_string: {
  //                 fields: ['cv.formations', 'cv.experiences'],
  //                 query: "Doctorat doctorat",
  //               },
  //             }
  //           ]
  //         }
          
  //       }
  //     };
  //   }
  //   else if(formation == "Doctorat"){
  //     body = {
  //       query: {
  //         query_string: {
  //           fields : ["cv.formations","cv.experiences"],
  //           query : "doctorat Doctorat"
  //         }
  //       }
  //     };
  //   }
  //   else{
  //     body = {
  //     query: {
  //       query_string: {
  //         fields : ["cv.formations","cv.experiences"],
  //         query : "ingénieur d'ingénieur ingénieurie d'ingénieurs"
  //       }
  //     }
  //   };
  //   }
  //   console.log(`résultat des personnes recherchées:`);
  //   await client.search({index: index, body: body})
  //   .then(results => {
  //     console.log(`found ${results.hits.total.value} items in ${results.took}ms`);
  //     if (results.hits.total > 0) console.log(`returned person name:`);
  //     results.hits.hits.forEach((hit, index) => {
  //     console.log(`\t${hit._id} - ${hit._source.nom} (score: ${hit._score})`);
  //     candidats.push(hit._source);
  //     });
  //   })
  //   .catch(console.error);
  //   if(candidats !== []){
  //     console.log("résultat trouvée!!");
  //     return candidats;
  //   }
  //   console.log("pas de résultat trouvée!!")
  //   return [];
  // }

  async createData(): Promise<boolean> {
    this.findAllPersonnes().then((personnes) => {
      personnes.forEach((personne) => {
        var str = personne.id.toString();
        let person = JSON.stringify(personne);
        client.index({
          index: 'cvs',
          id: str,
          body: person
        }, function(err, resp, status) {
              console.log(resp);
           });
           console.log("**person:",personne.nom ,"is pushed");
      });
      console.log("Successfully imported %s", personnes.length, " persons");
    });
    const { body: count } = await client.count({ index: 'cvs' })
    console.log("count: ",count);
    return true;
  }

  async createIndex(): Promise<boolean> {
    client.indices.create({
        index: 'cvs'
    }, function(error, response, status) {
        if (error) {
            console.log(error);
        } else {
            console.log("created a new index", response);
        }
    });
    return true;
  }

/***************Personne*********/

  async changeRecommande(idPersonne: number, value: boolean): Promise<Boolean> {
    this.personneRepository.createQueryBuilder()
        .update(Personne)
        .set({ recommande: value})
        .where('personne.id= :idPersonne',{idPersonne})
        .execute();
    return value;
  }

  async findAllPersonnes(): Promise<Personne[]> {
    const query = this.personneRepository.createQueryBuilder('personne');
        query.leftJoinAndSelect('personne.cv','cv')
        .leftJoinAndSelect('cv.competences','competences')
        // .leftJoinAndSelect('personne.candidatures','candidatures')
        // .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .orderBy('personne.nom');
    return query.getMany();
  }

  async findOnePersonne(idPer: number): Promise<Personne> {
    // return this.PersonneRepository.findOneOrFail(idCand, {
    //   relations: ['personne','personne.cv'],
    // });
    const query = this.personneRepository.createQueryBuilder('personne');
        query.where('personne.id= :idPer',{idPer})
        .leftJoinAndSelect('personne.cv','cv')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('personne.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
    return query.getOne();
  }

  async findPersonnesId(idPer1?: number[], idPer2?: number[]): Promise<Personne[]> {
    const query = this.personneRepository.createQueryBuilder('personne');
    if(idPer1){
      query.where('personne.id in (:idPer1)',{idPer1})
    }
    if(idPer2){
      query.andWhere('personne.id in (:idPer2)',{idPer2})
    }
    query.leftJoinAndSelect('personne.cv','cv')
    .leftJoinAndSelect('cv.competences','competences')
    return query.getMany();
  }

  async createPersonne(createPersonneInput: CreatePersonneInput): Promise<Personne>{
    const newPer = this.personneRepository.create(createPersonneInput);
    return this.personneRepository.save(newPer);
  }

  async updatePersonne(
    id: number,
    updatePersonneInput: UpdatePersonneInput,
  ): Promise<Personne> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newPersonne = await this.personneRepository.preload({
      id,
      ...updatePersonneInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newPersonne) {
      //si l id n existe pas
      throw new NotFoundException(`Personne d'id ${id} n'exsite pas!`);
    }
    return await this.personneRepository.save(newPersonne);
  }

//   async findCvPersonne(Personne: Personne): Promise<Cv> {
//       const id= Personne.cv.id;
//       const query = this.cvRepository.createQueryBuilder('cv');
//       query.where('cv.id= :id',{id})
//       .leftJoinAndSelect('cv.Personne','Personne');
//       return query.getOne();
//   }

  async removePersonne(idCand: number) {
    var supp = false;
    const personne = await this.findOnePersonne(idCand);
    const cv = await this.cvRepository.findOne({
        where: { id: personne.cv.id }
        });
    var PersonneToRemove=await this.personneRepository.remove(personne);
    console.log("delete personne:",personne)
    await this.cvRepository.remove(cv);
    console.log("delete cv:",cv.id);
    if (PersonneToRemove) supp=true;
    return await supp;
  }

  async removeCand(idCand: number) {
    var supp = false;
    const personne = await this.findOnePersonne(idCand);
    var PersonneToRemove=await this.personneRepository.remove(personne);
    console.log("delete personne:",personne)
    if (PersonneToRemove) supp=true;
    return await supp;
  }

  async restorePersonne(idCand: number) {
    return this.personneRepository.restore(idCand);
  }

  async getFilterCand(selectedComp?: string[]):Promise<Personne[]>{
    const query = this.personneRepository.createQueryBuilder('Personne');
      // .orWhere('formations.universite in (:selectedUniver)', { selectedUniver })
      // .orWhere('formations.niveau in (:selectedNiv)', { selectedNiv })
      // .orWhere('formations.specialite in (:selectedSpec)',{selectedSpec})
      if(selectedComp){
        query.andWhere('competences.nom in (:selectedComp)',{selectedComp})
      }
      query.leftJoinAndSelect('Personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .leftJoinAndSelect('Personne.cv', 'cv')
      .leftJoinAndSelect('cv.competences','competences')
      .orderBy('personne.nom');
    return query.getMany();
}

  /***************candidature*********/
  async findAllcandidatures(): Promise<Candidature[]> {
    const query = this.candidatureRepository.createQueryBuilder('candidature');
        query.leftJoinAndSelect('candidature.entretiens','entretiens')
        .leftJoinAndSelect('candidature.personne','personne')
        .leftJoinAndSelect('personne.cv','cv')
        .leftJoinAndSelect('cv.competences','competences');
    return query.getMany();
  }

  async findOnecandidature(idcandidature: number): Promise<Candidature> {
    const query = this.candidatureRepository.createQueryBuilder('candidature');
        query.where('candidature.id= :idcandidature',{idcandidature})
        .leftJoinAndSelect('candidature.entretiens','entretiens')
        .leftJoinAndSelect('candidature.personne','personne')
        .leftJoinAndSelect('personne.cv','cv')
        .leftJoinAndSelect('cv.competences','competences');
    return query.getOne();
  }
}
