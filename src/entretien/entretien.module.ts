import { Entretien } from './entities/entretien.entity';
import { Module } from '@nestjs/common';
import { EntretienService } from './entretien.service';
import { EntretienResolver } from './entretien.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entretien]),
    /*GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(),'schemas/schemaEntretien.gql'),
    }),*/
],
  providers: [EntretienResolver, EntretienService]
})
export class EntretienModule {}
