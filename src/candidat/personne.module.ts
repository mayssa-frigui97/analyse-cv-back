import { Candidature } from './entities/candidature.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './../cv/entities/cv.entity';
import { Personne } from './entities/personne.entity';
import { PersonneResolver } from './personne.resolver';
import { PersonneService } from './personne.service';
import { Entretien } from './../entretien/entities/entretien.entity';
import { CollaborateurModule } from './../collaborateur/collaborateur.module';
import { Competence } from 'src/cv/entities/competence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Candidature,
      Cv,
      Personne,
      Entretien,
      Competence,
    ]),
    // CvModule
    CollaborateurModule,
  ],
  providers: [PersonneResolver, PersonneService],
  exports: [PersonneService],
})
export class PersonneModule {}
