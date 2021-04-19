import { ActiviteAssociative } from './entities/activite.associative.entity';
import { Langue } from './entities/langue.entity';
import { Formation } from './entities/formation.entity';
import { Experience } from './entities/experience.entity';
import { Competence } from './entities/competence.entity';
import { Certificat } from './entities/certificat.entity';
import { Cv } from './entities/cv.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { Repository } from 'typeorm';
import { Candidat } from './../candidat/entities/candidat.entity';
import { UpdateCertifInput } from './dto/update-certif-input';
import { UpdateActAssocInput } from './dto/update-act-assoc-input';
import { UpdateLangueInput } from './dto/update-langue-input';
import { UpdateFormationInput } from './dto/update-formation-input';
import { UpdateExperienceInput } from './dto/update-experience-input';
import { UpdateCompetenceInput } from './dto/update-competence-input';

@Injectable()
export class CvService {

  constructor(
    @InjectRepository(Cv) 
    private cvRepository: Repository<Cv>,
    @InjectRepository(Certificat) 
    private certificatRepository: Repository<Certificat>,
    @InjectRepository(Competence) 
    private competenceRepository: Repository<Competence>,
    @InjectRepository(Experience) 
    private experienceRepository: Repository<Experience>,
    @InjectRepository(Formation) 
    private formationRepository: Repository<Formation>,
    @InjectRepository(Langue) 
    private langueRepository: Repository<Langue>,
    @InjectRepository(ActiviteAssociative) 
    private actRepository: Repository<ActiviteAssociative>){}

    /***************Cv*********/
    async findAllCVs():Promise<Cv[]>{
        //return this.cvRepository.find({relations: ['certificats','candidatures','experiences','formations','langues','competences','activiteAssociatives','candidat']});
        const query = this.cvRepository.createQueryBuilder('cv');
        query
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        .leftJoinAndSelect('cv.personne','personne')
        .leftJoinAndSelect('personne.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens');
        return query.getMany();
    }

    async findPostes():Promise<Cv[]>{
        const query = this.cvRepository.createQueryBuilder('cv');
        query.select('posteAct').where('cv.posteAct <> ""')
        .distinct(true);
        return query.getRawMany();
    }

    async findOneCV(id: number):Promise<Cv>{
        //return this.cvRepository.findOneOrFail(idCV,{relations: ['certificats','candidatures','experiences','formations','langues','competences','activiteAssociatives','candidat']});
        const query = this.cvRepository.createQueryBuilder('cv');
        query.where('cv.id= :id',{id})
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        .leftJoinAndSelect('cv.personne','personne')
        .leftJoinAndSelect('personne.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens');
        return query.getOne();
    }

    async findCvCandidat(idPer: number):Promise<Cv>{
        const query = this.cvRepository.createQueryBuilder('cv');
        query.where('personne.id = :idPer',{idPer})
        .leftJoinAndSelect('cv.langues','langues')
        .leftJoinAndSelect('cv.personne','personne')
        .leftJoinAndSelect('cv.formations','formations')
        .leftJoinAndSelect('cv.experiences','experiences')
        .leftJoinAndSelect('cv.competences','competences')
        .leftJoinAndSelect('cv.certificats','certificats')
        .leftJoinAndSelect('cv.activiteAssociatives','activiteAssociatives')
        .leftJoinAndSelect('personne.candidatures','candidatures')
        .leftJoinAndSelect('candidatures.entretiens','entretiens');
        return query.getOne();
    }

    async createCV(createCvInput: CreateCvInput):Promise<Cv>{
        const newCV=this.cvRepository.create(createCvInput);
        return this.cvRepository.save(newCV);
    }

    async updateCV(id: number, updateCVInput: UpdateCvInput):Promise<Cv> {
        //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
        const newCV= await this.cvRepository.preload({
          id,
          ...updateCVInput
      })
      //et la on va sauvegarder la nv entité
      if(!newCV){//si l id n existe pas
          throw new NotFoundException(`CV d'id ${id} n'exsite pas!`);
      }
      return await this.cvRepository.save(newCV);
      }
    
    async removeCV(idCv: number):Promise<boolean> {
        var supp=false;
        const cv= await this.findOneCV(idCv);
        console.log("cv:",cv)
        const cvtoremove=this.cvRepository.remove(cv);
        if (cvtoremove) {
            supp=true;
        }
        return await supp;
      }

      /***************Certificat*********/
    async findAllCertificats():Promise<Certificat[]>{
        return this.certificatRepository.find({relations: ['cvs','cvs.personne']});
    }

    async findOneCertificat(idCertif: number):Promise<Certificat>{
        return this.certificatRepository.findOneOrFail(idCertif,{relations: ['cvs','cvs.personne']});
    }

    async updateCertif(id: number, updateCertifInput: UpdateCertifInput):Promise<Certificat> {
        //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
        const newCertif= await this.certificatRepository.preload({
          id,
          ...updateCertifInput
      })
      //et la on va sauvegarder la nv entité
      if(!newCertif){//si l id n existe pas
          throw new NotFoundException(`certificat d'id ${id} n'exsite pas!`);
      }
      return await this.certificatRepository.save(newCertif);
    }

      /***************Competence*********/
    async findAllCompetences():Promise<Competence[]>{
        const query = this.competenceRepository.createQueryBuilder('competence');
        query.select('nom')
        .distinct(true);
        return query.getRawMany();
    }

    async findOneCompetence(idComp: number):Promise<Competence>{
        return this.competenceRepository.findOneOrFail(idComp,{relations: ['cvs','cvs.personne']});
    }

    async updateCompetence(id: number, updateCompetenceInput: UpdateCompetenceInput):Promise<Competence> {
        //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
        const newCompetence= await this.competenceRepository.preload({
          id,
          ...updateCompetenceInput
      })
      //et la on va sauvegarder la nv entité
      if(!newCompetence){//si l id n existe pas
          throw new NotFoundException(`Competence d'id ${id} n'exsite pas!`);
      }
      return await this.competenceRepository.save(newCompetence);
    }

      /***************Experience*********/
    async findAllExperiences():Promise<Experience[]>{
        return this.experienceRepository.find({relations: ['cvs','cvs.personne']});
    }

    async findOneExperience(idExp: number):Promise<Experience>{
        return this.experienceRepository.findOneOrFail(idExp,{relations: ['cvs','cvs.personne']});
    }

    async updateExperience(id: number, updateExperienceInput: UpdateExperienceInput):Promise<Experience> {
        //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
        const newExperience= await this.experienceRepository.preload({
          id,
          ...updateExperienceInput
      })
      //et la on va sauvegarder la nv entité
      if(!newExperience){//si l id n existe pas
          throw new NotFoundException(`experience d'id ${id} n'exsite pas!`);
      }
      return await this.experienceRepository.save(newExperience);
    }
      /***************Formation*********/
    async findUniverFormations():Promise<Formation[]>{
        const query = this.formationRepository.createQueryBuilder('formation');
        query.select('universite').where("formation.universite NOT LIKE 'Lycée%'")
        .distinct(true);
        return query.getRawMany();
    }

    async findSpecFormations():Promise<Formation[]>{
        const query = this.formationRepository.createQueryBuilder('formation');
        query.select('specialite')
        .distinct(true);
        return query.getRawMany();
    }

    async findNivFormations():Promise<Formation[]>{
        const query = this.formationRepository.createQueryBuilder('formation');
        query.select('niveau').where("formation.universite NOT LIKE 'Baccalauréat%'")
        .distinct(true);
        return query.getRawMany();
    }

    async findOneFormation(idForm: number):Promise<Formation>{
        return this.formationRepository.findOneOrFail(idForm,{relations: ['cvs','cvs.personne']});
    }

    async updateFormation(id: number, updateFormationInput: UpdateFormationInput):Promise<Formation> {
        //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
        const newFormation= await this.formationRepository.preload({
          id,
          ...updateFormationInput
      })
      //et la on va sauvegarder la nv entité
      if(!newFormation){//si l id n existe pas
          throw new NotFoundException(`Formation d'id ${id} n'exsite pas!`);
      }
      return await this.formationRepository.save(newFormation);
    }

      /***************Langue*********/
    async findAllLangues():Promise<Langue[]>{
        const query = this.langueRepository.createQueryBuilder('langue');
        query.select('nom')
        .distinct(true);
        return query.getRawMany();
    }

    async findOneLangue(idLang: number):Promise<Langue>{
        return this.langueRepository.findOneOrFail(idLang,{relations: ['cvs','cvs.personne']});
    }

    async updateLangue(id: number, updateLangueInput: UpdateLangueInput):Promise<Langue> {
        //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
        const newLangue= await this.langueRepository.preload({
          id,
          ...updateLangueInput
      })
      //et la on va sauvegarder la nv entité
      if(!newLangue){//si l id n existe pas
          throw new NotFoundException(`Langue d'id ${id} n'exsite pas!`);
      }
      return await this.langueRepository.save(newLangue);
    }

      /***************Activite associative*********/
      async findAllActs():Promise<ActiviteAssociative[]>{
        return this.actRepository.find({relations: ['cvs','cvs.personne']});
    }

    async findOneAct(idAct: number):Promise<ActiviteAssociative>{
        return this.actRepository.findOneOrFail(idAct,{relations: ['cvs','cvs.personne']});
    }

    async updateAct(id: number, updateActAssocInput: UpdateActAssocInput):Promise<ActiviteAssociative> {
        //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
        const newAct= await this.actRepository.preload({
          id,
          ...updateActAssocInput
      })
      //et la on va sauvegarder la nv entité
      if(!newAct){//si l id n existe pas
          throw new NotFoundException(`act associative d'id ${id} n'exsite pas!`);
      }
      return await this.actRepository.save(newAct);
    }
}
