import { CandidatService } from './../candidat/candidat.service';
import { Langue } from './entities/langue.entity';
import { Formation } from './entities/formation.entity';
import { Experience } from './entities/experience.entity';
import { Competence } from './entities/competence.entity';
import { Certificat } from './entities/certificat.entity';
import { Cv } from './entities/cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvResolver } from './cv.resolver';
import { ActiviteAssociative } from './entities/activite.associative.entity';
import { CandidatModule } from 'src/candidat/candidat.module';
import { Candidat } from './../candidat/entities/candidat.entity';
import { Personne } from '../candidat/entities/personne.entity';

@Module({
  imports: [
  
TypeOrmModule.forFeature([Cv,Certificat,Competence,Experience,Formation,Langue,ActiviteAssociative]),
  // forwardRef(() => CandidatModule)
],
  providers: [CvResolver, CvService],
  exports:[CvService]
})
export class CvModule {}
