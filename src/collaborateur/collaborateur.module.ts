import { Pole } from './entities/pole.entity';
import { Equipe } from './entities/equipe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CollaborateurResolver } from './collaborateur.resolver';
import { CollaborateurService } from './collaborateur.service';
import { Collaborateur } from './entities/collaborateur.entity';
import { Personne } from '../candidat/entities/personne.entity';
import { Cv } from 'src/cv/entities/cv.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Collaborateur, Equipe, Pole, Personne, Cv]), //ken mch fi nafs l module tzid lmodule hna(many to one)
  ],
  providers: [CollaborateurService, CollaborateurResolver],
  exports: [CollaborateurService],
})
export class CollaborateurModule {}
