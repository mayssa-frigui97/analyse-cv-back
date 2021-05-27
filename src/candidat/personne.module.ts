import { Candidature } from './entities/candidature.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from 'src/cv/entities/cv.entity';
 import { Personne } from './entities/personne.entity';
import { PersonneResolver } from './personne.resolver';
import { PersonneService } from './personne.service';
import { Entretien } from './../entretien/entities/entretien.entity';
 
@Module({
  imports: [
TypeOrmModule.forFeature([Candidature,Cv,Personne,Entretien]),
    // CvModule
],
  providers: [PersonneResolver, PersonneService],
  exports:[PersonneService]
})
export class PersonneModule {}
