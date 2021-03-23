import { CvService } from './../cv/cv.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidature } from './entities/candidature.entity';
import { Candidat } from './entities/candidat.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidatInput } from './dto/create-candidat.input';
import { UpdateCandidatInput } from './dto/update-candidat.input';
import { Repository } from 'typeorm';

@Injectable()
export class CandidatService {
  constructor(
    @InjectRepository(Candidat) 
    private candidatRepository: Repository<Candidat>,
    @InjectRepository(Candidature) 
    private candidatureRepository: Repository<Candidature>,
    // private cvService: CvService
    ){}

    /***************Candidat*********/
    async findAllCandidat():Promise<Candidat[]>{
      return this.candidatRepository.find();
  }

  async findOneCandidat(idCandidat: number):Promise<Candidat>{
      return this.candidatRepository.findOneOrFail(idCandidat);
  }

  async createCandidat(createCandidatInput: CreateCandidatInput):Promise<Candidat>{
      const newCandidat=this.candidatRepository.create(createCandidatInput);
      return this.candidatRepository.save(newCandidat);
  }

  async updateCandidat(id: number, updateCandidatInput: UpdateCandidatInput):Promise<Candidat> {
      //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
      const newCandidat= await this.candidatRepository.preload({
        id,
        ...updateCandidatInput
    })
    //et la on va sauvegarder la nv entité
    if(!newCandidat){//si l id n existe pas
        throw new NotFoundException(`Candidat d'id ${id} n'exsite pas!`);
    }
    return await this.candidatRepository.save(newCandidat);
    }
  
  async removeCandidat(idCandidat: number):Promise<boolean> {
      var supp=false;
      const Candidattoremove= await this.findOneCandidat(idCandidat);
      this.candidatRepository.remove(Candidattoremove);
      if (Candidattoremove) supp=true;
      return await supp;
    }

    /***************Candidature*********/
  async findAllCandidatures():Promise<Candidature[]>{
      return this.candidatureRepository.find({relations: ['cv','cv.candidat','entretiens']});
  }

  async findOneCandidature(idCandidature: number):Promise<Candidature>{
      return this.candidatureRepository.findOneOrFail(idCandidature,{relations: ['cv','cv.candidat','entretiens']});
  }

  // async findCv(cvId: number):Promise<Cv>{
  //   return this.cvService.findOneCV(cvId);
  // }

  
}
