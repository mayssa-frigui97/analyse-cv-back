import { InjectRepository } from '@nestjs/typeorm';
import { Candidature } from './entities/candidature.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cv } from '../cv/entities/cv.entity';
import { Personne } from './entities/personne.entity';
import { CreatePersonneInput } from './../Candidat/dto/create-personne.input';
import { UpdatePersonneInput } from './dto/update-personne.input';
import { CreateCandidatureInput } from './dto/create-candidature.input';

//require the Elasticsearch librray
// eslint-disable-next-line @typescript-eslint/no-var-requires
const elasticsearch = require('elasticsearch');
// instantiate an Elasticsearch client
const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200'],
});

@Injectable()
export class PersonneService {
  constructor(
    @InjectRepository(Candidature)
    private candidatureRepository: Repository<Candidature>,
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(Personne)
    private personneRepository: Repository<Personne>,
  ) {}

  /***************Requette ElasticSearch*********/

  async search(mot: string): Promise<Personne[]> {
    const candidats: Personne[] = [];
    const word = '*' + mot + '*';
    const index = 'cvs';
    const body = {
      query: {
        query_string: {
          query: word,
        },
      },
    };
    console.log(
      `résultat des personnes recherchées pour :'${body.query.query_string.query}'`,
    );
    await client
      .search({ index: index, body: body })
      .then((results) => {
        console.log(
          `found ${results.hits.total.value} items in ${results.took}ms`,
        );
        if (results.hits.total > 0) console.log(`returned person name:`);
        results.hits.hits.forEach((hit, index) => {
          console.log(
            `\t${hit._id} - ${hit._source.nom} (score: ${hit._score})`,
          );
          candidats.push(hit._source);
        });
      })
      .catch(console.error);
    if (candidats !== []) {
      console.log('résultat trouvée!!');
      return candidats;
    }
    console.log('pas de résultat trouvée!!');
    return [];
  }

  async createData(): Promise<boolean> {
    this.findAllPersonnes().then((personnes) => {
      personnes.forEach((personne) => {
        const str = personne.id.toString();
        const person = JSON.stringify(personne);
        client.index(
          {
            index: 'cvs',
            id: str,
            body: person,
          },
          function (err, resp, status) {
            console.log(resp);
          },
        );
        console.log('**person:', personne.nom, 'is pushed');
      });
      console.log('Successfully imported %s', personnes.length, ' persons');
    });
    const { body: count } = await client.count({ index: 'cvs' });
    console.log('count: ', count);
    return true;
  }

  async createIndex(): Promise<boolean> {
    client.indices.create(
      {
        index: 'cvs',
      },
      function (error, response, status) {
        if (error) {
          console.log(error);
        } else {
          console.log('created a new index', response);
        }
      },
    );
    return true;
  }

  /***************Personne*********/

  async findPerByMail(email: string): Promise<Personne> {
    const query = this.personneRepository.createQueryBuilder('personne');
    query
      .where('personne.email= :email', { email })
      .leftJoinAndSelect('personne.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences');
    return query.getOne();
  }

  async changeRecommande(idPersonne: number, value: boolean): Promise<boolean> {
    this.personneRepository
      .createQueryBuilder()
      .update(Personne)
      .set({ recommande: value })
      .where('personne.id= :idPersonne', { idPersonne })
      .execute();
    return value;
  }

  async findAllPersonnes(): Promise<Personne[]> {
    const query = this.personneRepository.createQueryBuilder('personne');
    query
      .leftJoinAndSelect('personne.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
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
    query
      .where('personne.id= :idPer', { idPer })
      .leftJoinAndSelect('personne.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
    return query.getOne();
  }

  async findPersonnesId(
    idPer1?: number[],
    idPer2?: number[],
  ): Promise<Personne[]> {
    const query = this.personneRepository.createQueryBuilder('personne');
    if (idPer1) {
      query.where('personne.id in (:idPer1)', { idPer1 });
    }
    if (idPer2) {
      query.andWhere('personne.id in (:idPer2)', { idPer2 });
    }
    query
      .leftJoinAndSelect('personne.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences');
    return query.getMany();
  }

  async createPersonne(
    createPersonneInput: CreatePersonneInput,
  ): Promise<Personne> {
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

  async removePersonne(idCand: number) {
    let supp = false;
    const personne = await this.findOnePersonne(idCand);
    const cv = await this.cvRepository.findOne({
      where: { id: personne.cv.id },
    });
    const PersonneToRemove = await this.personneRepository.remove(personne);
    console.log('delete personne:', personne);
    await this.cvRepository.remove(cv);
    console.log('delete cv:', cv.id);
    if (PersonneToRemove) supp = true;
    return await supp;
  }

  async removeCand(idCand: number) {
    let supp = false;
    const personne = await this.findOnePersonne(idCand);
    const PersonneToRemove = await this.personneRepository.remove(personne);
    console.log('delete personne:', personne);
    if (PersonneToRemove) supp = true;
    return await supp;
  }

  async restorePersonne(idCand: number) {
    return this.personneRepository.restore(idCand);
  }

  async getFilterCand(selectedComp?: string[]): Promise<Personne[]> {
    const query = this.personneRepository.createQueryBuilder('Personne');
    if (selectedComp) {
      query.andWhere('competences.nom in (:selectedComp)', { selectedComp });
    }
    query
      .leftJoinAndSelect('Personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .leftJoinAndSelect('Personne.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
      .orderBy('personne.nom');
    return query.getMany();
  }

  /***************candidature*********/
  async findAllcandidatures(): Promise<Candidature[]> {
    const query = this.candidatureRepository.createQueryBuilder('candidature');
    query
      .leftJoinAndSelect('candidature.entretiens', 'entretiens')
      .leftJoinAndSelect('candidature.personne', 'personne')
      .leftJoinAndSelect('personne.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences');
    return query.getMany();
  }

  async findOnecandidature(idcandidature: number): Promise<Candidature> {
    const query = this.candidatureRepository.createQueryBuilder('candidature');
    query
      .where('candidature.id= :idcandidature', { idcandidature })
      .leftJoinAndSelect('candidature.entretiens', 'entretiens')
      .leftJoinAndSelect('candidature.personne', 'personne')
      .leftJoinAndSelect('personne.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences');
    return query.getOne();
  }

  async createCandidature(
    createCandidatureInput: CreateCandidatureInput,
  ): Promise<Candidature> {
    const candId = createCandidatureInput.candidatId;
    const query = this.personneRepository.createQueryBuilder('personne');
    query.where('personne.id= :candId', { candId });
    const newCand = this.candidatureRepository.create(createCandidatureInput);
    const candidat = await query.getOne();
    newCand.personne = candidat;
    console.log('candidat', candidat);
    return this.candidatureRepository.save(newCand);
  }
}
