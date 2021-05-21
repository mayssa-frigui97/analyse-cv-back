import { InjectRepository } from '@nestjs/typeorm';
import { Candidature } from './entities/candidature.entity';
import { Candidat } from './entities/candidat.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidatInput } from './dto/create-candidat.input';
import { UpdateCandidatInput } from './dto/update-candidat.input';
import { Repository } from 'typeorm';
import { Cv } from './../cv/entities/cv.entity';
import { Personne } from './entities/personne.entity';
import { CreatePersonneInput } from 'src/candidat/dto/create-personne.input';

@Injectable()
export class CandidatService {
  constructor(
    @InjectRepository(Candidat)
    private candidatRepository: Repository<Candidat>,
    @InjectRepository(Candidature)
    private candidatureRepository: Repository<Candidature>,
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(Personne)
    private personneRepository: Repository<Personne>
  ) {}

  /***************Candidat*********/
  async findAllCandidat(): Promise<Candidat[]> {
    const query = this.candidatRepository.createQueryBuilder('candidat');
        query.leftJoinAndSelect('candidat.cv','cv')
        .leftJoinAndSelect('candidat.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives');
    return query.getMany();
  }

  async findOneCandidat(idCand: number): Promise<Candidat> {
    // return this.candidatRepository.findOneOrFail(idCand, {
    //   relations: ['personne','personne.cv'],
    // });
    const query = this.candidatRepository.createQueryBuilder('candidat');
        query.where('candidat.id= :idCand',{idCand})
        .leftJoinAndSelect('candidat.cv','cv')
        .leftJoinAndSelect('candidat.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives');
    return query.getOne();
  }

  async createCandidat(createCandidatInput: CreateCandidatInput): Promise<Candidat>{
    //const newPer = this.personneRepository.create(createCandidatInput.createPersonneInput);
    const newCandidat = this.candidatRepository.create(createCandidatInput);
    //this.personneRepository.save(newPer);
    return this.candidatRepository.save(newCandidat);
  }

  async updateCandidat(
    id: number,
    updateCandidatInput: UpdateCandidatInput,
  ): Promise<Candidat> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newCandidat = await this.candidatRepository.preload({
      id,
      ...updateCandidatInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newCandidat) {
      //si l id n existe pas
      throw new NotFoundException(`Candidat d'id ${id} n'exsite pas!`);
    }
    return await this.candidatRepository.save(newCandidat);
  }

//   async findCvCandidat(candidat: Candidat): Promise<Cv> {
//       const id= candidat.cv.id;
//       const query = this.cvRepository.createQueryBuilder('cv');
//       query.where('cv.id= :id',{id})
//       .leftJoinAndSelect('cv.candidat','candidat');
//       return query.getOne();
//   }

  async removeCandidat(idCand: number) {
    var supp = false;
    const candidat = await this.findOneCandidat(idCand);
    const personne = await this.personneRepository.findOne(idCand);
    const cv = await this.cvRepository.findOne({
        where: { id: candidat.cv.id }
        });
    await this.personneRepository.remove(personne);
    console.log("delete personne:",personne)
    await this.cvRepository.remove(cv);
    console.log("delete cv:",cv.id)
    const candidatToRemove=await this.candidatRepository.remove(candidat);
    if (candidatToRemove) supp=true;
    return await supp;
  }

  async restoreCandidat(idCand: number) {
    return this.candidatRepository.restore(idCand);
  }

  async getFilterCand(selectedNiv?: string[], selectedSpec?: string[],selectedUniver?: string[],selectedPoste?: string[],selectedComp?: string[]):Promise<Candidat[]>{
    const query = this.candidatRepository.createQueryBuilder('candidat');
    query
      .where('cv.posteAct in (:selectedPoste)',{selectedPoste})
      .orWhere('formations.universite in (:selectedUniver)', { selectedUniver })
      .orWhere('formations.niveau in (:selectedNiv)', { selectedNiv })
      .orWhere('formations.specialite in (:selectedSpec)',{selectedSpec})
      .orWhere('competences.nom in (:selectedComp)',{selectedComp})
      .leftJoinAndSelect('candidat.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .leftJoinAndSelect('candidat.cv', 'cv')
      .leftJoinAndSelect('cv.langues', 'langues')
      .leftJoinAndSelect('cv.formations', 'formations')
      .leftJoinAndSelect('cv.experiences', 'experiences')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('cv.certificats', 'certificats')
      .leftJoinAndSelect('cv.activiteAssociatives', 'activiteAssociatives');
    return query.getMany();
}

  /***************Candidature*********/
  async findAllCandidatures(): Promise<Candidature[]> {
    const query = this.candidatureRepository.createQueryBuilder('candidature');
        query.leftJoinAndSelect('candidature.entretiens','entretiens')
        .leftJoinAndSelect('candidature.personne','personne')
        .leftJoinAndSelect('personne.cv','cv')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives');
    return query.getMany();
  }

  async findOneCandidature(idCandidature: number): Promise<Candidature> {
    const query = this.candidatureRepository.createQueryBuilder('candidature');
        query.where('candidature.id= :idCandidature',{idCandidature})
        .leftJoinAndSelect('candidature.entretiens','entretiens')
        .leftJoinAndSelect('candidature.personne','personne')
        .leftJoinAndSelect('personne.cv','cv')
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives');
    return query.getOne();
  }

  // async findCv(cvId: number):Promise<Cv>{
  //   return this.cvService.findOneCV(cvId);
  // }
}
