import { CvModule } from './../cv/cv.module';
import { Candidature } from './entities/candidature.entity';
import { Candidat } from './entities/candidat.entity';
import { Module } from '@nestjs/common';
import { CandidatService } from './candidat.service';
import { CandidatResolver } from './candidat.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidat,Candidature]),
    /*GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(),'schemas/schemaCandidat.gql'),
    }),*/
    //CvModule
],
  providers: [CandidatResolver, CandidatService]
})
export class CandidatModule {}
