import { InjectRepository } from '@nestjs/typeorm';
import { Candidature } from './entities/candidature.entity';
import { Candidat } from './entities/candidat.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidatInput } from './dto/create-candidat.input';
import { UpdateCandidatInput } from './dto/update-candidat.input';
import { Repository } from 'typeorm';
import { Cv } from './../cv/entities/cv.entity';
import { Personne } from './entities/personne.entity';

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
    const newCandidat = this.candidatRepository.create(createCandidatInput);
    // const newPersonne= this.personneRepository.create(createCandidatInput.)
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

//   async findCvCandidat2(candidat: Candidat): Promise<Cv> {
//     return this.cvService.findCvCandidat(candidat.cv.id);
// }

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

    // const candidat = this.candidatRepository.createQueryBuilder('candidat');
    // candidat
    //   .where('candidat.id= :id', { id })
    //   .leftJoinAndSelect('candidat.cv', 'cv')
    //   .getOne();

    // const candidat = await this.findOneCandidat(idCand);
    // const idcv = candidat.cv.id;
    // const cv = this.cvRepository.createQueryBuilder('cv');
    // cv.where('cv.id= :', { idcv })
    //   .leftJoinAndSelect('candidat.cv', 'cv')
    //   .getOne();
    // const cv = await this.findCvCandidat(candidat);



    // const candidat = await this.candidatRepository.findOne({
    //   where: { id: 'idCand' },
    //   relations: ['cv'],
    // });
    // const candidat= await this.findOneCandidat(idCand);
    // const cv = await this.cvRepository.findOne({
    //   where: { id: candidat.cv.id }
    //   });
    
    // candidat.cv=null;
    
    // console.log("candidat:",candidat);
    // await this.cvRepository.remove(cv);
    // await this.candidatRepository.remove(candidat);
    // if (candidat)
    //   supp = true;
    // return await supp;
  }

  async restoreCandidat(idCand: number) {
    return this.candidatRepository.restore(idCand);
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
