import { Pole } from './entities/pole.entity';
import { Equipe } from './entities/equipe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CollaborateurResolver } from './collaborateur.resolver';
import { CollaborateurService } from './collaborateur.service';
import { Collaborateur } from './entities/collaborateur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collaborateur,Equipe,Pole]),//ken mch fi nafs l module tzid lmodule hna(many to one)
    /*GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(),'schemas/schemaCol.gql'),
    }),*/
],
  providers: [CollaborateurService, CollaborateurResolver]
})
export class CollaborateurModule {}
