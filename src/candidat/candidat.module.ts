import { Candidature } from './entities/candidature.entity';
import { Candidat } from './entities/candidat.entity';
import { forwardRef, Module } from '@nestjs/common';
import { CandidatService } from './candidat.service';
import { CandidatResolver } from './candidat.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from 'src/cv/entities/cv.entity';
 import { Personne } from './entities/personne.entity';
import { CvModule } from 'src/cv/cv.module';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Candidat,Candidature,Cv,Personne]),
    // CvModule
],
  providers: [CandidatResolver, CandidatService]
})
export class CandidatModule {}
