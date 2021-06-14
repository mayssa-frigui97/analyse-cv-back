import { Candidature } from './entities/candidature.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from 'src/cv/entities/cv.entity';
import { Personne } from './entities/personne.entity';
import { PersonneResolver } from './personne.resolver';
import { PersonneService } from './personne.service';
import { Entretien } from './../entretien/entities/entretien.entity';
import { CollaborateurModule } from 'src/collaborateur/collaborateur.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidature, Cv, Personne, Entretien]),
    // CvModule
    CollaborateurModule,
  ],
  providers: [PersonneResolver, PersonneService],
  exports: [PersonneService],
})
export class PersonneModule {}
