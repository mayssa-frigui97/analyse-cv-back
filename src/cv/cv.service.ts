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

    async findCvCandidat(id: number):Promise<Cv>{
        const query = this.cvRepository.createQueryBuilder('cv');
        query.where('candidat.personne.id= :id',{id})
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
        
        // const cv = await this.cvRepository.findOne({
        //     where: { id: idCv },
        //     relations: ['candidat'] });
        // const candidat = await this.candidatRepository.findOne({
        //     where: { id: cv.candidat.id },
        //   });
        // candidat.cv=null;
        // await this.cvRepository.remove(cv);
        // await this.candidatRepository.remove(candidat);
        // if (cv) supp = true;
        return await supp;
      }

      /***************Certificat*********/
    async findAllCertificats():Promise<Certificat[]>{
        return this.certificatRepository.find({relations: ['cvs','cvs.personne']});
    }

    async findOneCertificat(idCertif: number):Promise<Certificat>{
        return this.certificatRepository.findOneOrFail(idCertif,{relations: ['cvs','cvs.personne']});
    }

      /***************Competence*********/
    async findAllCompetences():Promise<Competence[]>{
        return this.competenceRepository.find({relations: ['cvs','cvs.personne']});
    }

    async findOneCompetence(idComp: number):Promise<Competence>{
        return this.competenceRepository.findOneOrFail(idComp,{relations: ['cvs','cvs.personne']});
    }

      /***************Experience*********/
    async findAllExperiences():Promise<Experience[]>{
        return this.experienceRepository.find({relations: ['cvs','cvs.personne']});
    }

    async findOneExperience(idExp: number):Promise<Experience>{
        return this.experienceRepository.findOneOrFail(idExp,{relations: ['cvs','cvs.personne']});
    }

    async findExperienceCv(idCv: number): Promise<Experience[]> {
      const query = this.experienceRepository.createQueryBuilder('experience');
        query.where('cvs.id= :idCv',{idCv})
        .leftJoinAndSelect('experience.cvs','cvs');

        return query.getMany();
    }
      /***************Formation*********/
      async findAllFormations():Promise<Formation[]>{
        return this.formationRepository.find({relations: ['cvs','cvs.personne']});
    }

    async findOneFormation(idForm: number):Promise<Formation>{
        return this.formationRepository.findOneOrFail(idForm,{relations: ['cvs','cvs.personne']});
    }

      /***************Langue*********/
    async findAllLangues():Promise<Langue[]>{
        return this.langueRepository.find({relations: ['cvs','cvs.personne']});
    }

    async findOneLangue(idLang: number):Promise<Langue>{
        return this.langueRepository.findOneOrFail(idLang,{relations: ['cvs','cvs.personne']});
    }

      /***************Activite associative*********/
      async findAllActs():Promise<ActiviteAssociative[]>{
        return this.actRepository.find({relations: ['cvs','cvs.personne']});
    }

    async findOneAct(idAct: number):Promise<ActiviteAssociative>{
        return this.actRepository.findOneOrFail(idAct,{relations: ['cvs','cvs.personne']});
    }
}
