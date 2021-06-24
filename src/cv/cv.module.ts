import { Cv } from './entities/cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvResolver } from './cv.resolver';
import { PersonneModule } from './../candidat/personne.module';
import { Competence } from './entities/competence.entity';
import { Personne } from './../candidat/entities/personne.entity';
import { Collaborateur } from './../collaborateur/entities/collaborateur.entity';
import { CollaborateurModule } from './../collaborateur/collaborateur.module';
import { Candidature } from 'src/candidat/entities/candidature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cv,
      Competence,
      Personne,
      Collaborateur,
      Candidature,
    ]),
    PersonneModule,
    CollaborateurModule,
  ],
  providers: [CvResolver, CvService],
  exports: [CvService],
})
export class CvModule {}
