import { InjectRepository } from '@nestjs/typeorm';
import { Candidature } from './entities/candidature.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cv } from '../cv/entities/cv.entity';
import { Personne } from './entities/personne.entity';
import { CreatePersonneInput } from 'src/Candidat/dto/create-personne.input';
import { UpdatePersonneInput } from './dto/update-personne.input';

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

  /***************Personne*********/

  async changeRecommande(idPersonne: number, value: boolean): Promise<Boolean> {
    this.personneRepository.createQueryBuilder()
        .update(Personne)
        .set({ recommande: value})
        .where('personne.id= :idPersonne',{idPersonne})
        .execute();
    // const query = this.personneRepository.createQueryBuilder('personne')
    //     .leftJoinAndSelect('personne.cv','cv')
    //     .leftJoinAndSelect('personne.candidatures','candidatures')
    //     .leftJoinAndSelect('candidatures.entretiens','entretiens')
    // return query.getMany();
    return value;
  }

  async findAllPersonnes(): Promise<Personne[]> {
    const query = this.personneRepository.createQueryBuilder('personne');
        query.leftJoinAndSelect('personne.cv','cv')
        .leftJoinAndSelect('personne.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
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
        .leftJoinAndSelect('personne.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
    return query.getOne();
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

  async restorePersonne(idCand: number) {
    return this.personneRepository.restore(idCand);
  }

  async getFilterCand(selectedNiv?: string[], selectedSpec?: string[],selectedUniver?: string[],selectedComp?: string[]):Promise<Personne[]>{
    const query = this.personneRepository.createQueryBuilder('Personne');
    query
      .orWhere('formations.universite in (:selectedUniver)', { selectedUniver })
      .orWhere('formations.niveau in (:selectedNiv)', { selectedNiv })
      .orWhere('formations.specialite in (:selectedSpec)',{selectedSpec})
      .orWhere('competences.nom in (:selectedComp)',{selectedComp})
      .leftJoinAndSelect('Personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .leftJoinAndSelect('Personne.cv', 'cv')
      .orderBy('personne.nom');
    return query.getMany();
}

  /***************candidature*********/
  async findAllcandidatures(): Promise<Candidature[]> {
    const query = this.candidatureRepository.createQueryBuilder('candidature');
        query.leftJoinAndSelect('candidature.entretiens','entretiens')
        .leftJoinAndSelect('candidature.personne','personne')
        .leftJoinAndSelect('personne.cv','cv');
    return query.getMany();
  }

  async findOnecandidature(idcandidature: number): Promise<Candidature> {
    const query = this.candidatureRepository.createQueryBuilder('candidature');
        query.where('candidature.id= :idcandidature',{idcandidature})
        .leftJoinAndSelect('candidature.entretiens','entretiens')
        .leftJoinAndSelect('candidature.personne','personne')
        .leftJoinAndSelect('personne.cv','cv');
    return query.getOne();
  }
}
