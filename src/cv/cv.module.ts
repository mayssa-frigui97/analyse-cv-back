import { Cv } from './entities/cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvResolver } from './cv.resolver';
import { PersonneModule } from 'src/candidat/personne.module';
import { Competence } from './entities/competence.entity';
import { Personne } from './../candidat/entities/personne.entity';

@Module({
  imports: [

TypeOrmModule.forFeature([Cv,Competence,Personne]),
  PersonneModule
],
  providers: [CvResolver, CvService],
  exports:[CvService]
})
export class CvModule {}
