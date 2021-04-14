import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entretien } from './entities/entretien.entity';

@Injectable()
export class EntretienService {
  
  constructor(
    @InjectRepository(Entretien) 
    private entretienRepository: Repository<Entretien>){}

    /**********Entretien******************/
    async findAllEntretiens():Promise<Entretien[]>{
        // return this.entretienRepository.find({relations: ['candidature','candidature.cv']});
        const query = this.entretienRepository.createQueryBuilder('entretien');
        query
        .leftJoinAndSelect('entretien.candidature', 'candidature')
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

    async findOneEntretien(id: number):Promise<Entretien>{
        //return this.entretienRepository.findOneOrFail(idEnt,{relations: ['candidature']});
        const query = this.entretienRepository.createQueryBuilder('entretien');
        query.where('entretien.id= :id',{id})
        .leftJoinAndSelect('entretien.candidature', 'candidature')
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
}
