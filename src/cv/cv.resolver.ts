import { ActiviteAssociative } from './entities/activite.associative.entity';
import { Experience } from './entities/experience.entity';
import { Competence } from './entities/competence.entity';
import { Certificat } from './entities/certificat.entity';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { Formation } from './entities/formation.entity';
import { Langue } from './entities/langue.entity';

@Resolver(() => Cv)
export class CvResolver {
  constructor(private readonly cvService: CvService) {}

  /***********CV**************/

  @Mutation(() => Cv)
  CreateCv(@Args('createCvInput') createCvInput: CreateCvInput) {
    return this.cvService.createCV(createCvInput);
  }

  @Query(() => [Cv], { name: 'FindCVs' })
  FindAllCVs() {
    return this.cvService.findAllCVs();
  }

  @Query(() => Cv, { name: 'FindCV' })
  FindOneCV(@Args('idCV', { type: () => Int }) idCV: number) {
    return this.cvService.findOneCV(idCV);
  }

  @Mutation(() => Cv)
  UpdateCv(
    @Args('idCV', { type: () => Int }) idCV: number,
    @Args('updateCvInput') updateCvInput: UpdateCvInput) {
    return this.cvService.updateCV(idCV, updateCvInput);
  }

  @Mutation(() => Boolean)
  RemoveCv(@Args('idCV', { type: () => Int }) idCV: number) {
    var supp=this.cvService.removeCV(idCV);
    return supp;
  }

  /***********Certificat**************/
  @Query(returns => [Certificat])
    FindCertificats(): Promise<Certificat[]>{
        return this.cvService.findAllCertificats();
    }

    @Query(returns => Certificat)
    FindCertificat(@Args('idCertif',{type: () => Int}) idCertif: number): Promise<Certificat>{
        return this.cvService.findOneCertificat(idCertif);
    }

  /***********Competence***********/
  @Query(returns => [Competence])
    FindCompetences(): Promise<Competence[]>{
        return this.cvService.findAllCompetences();
    }

    @Query(returns => Competence)
    FindCompetence(@Args('idComp',{type: () => Int}) idComp: number): Promise<Competence>{
        return this.cvService.findOneCompetence(idComp);
    }

  /***********Experience***********/
  @Query(returns => [Experience])
    FindExperiences(): Promise<Experience[]>{
        return this.cvService.findAllExperiences();
    }

    @Query(returns => Experience)
    FindExperience(@Args('idExp',{type: () => Int}) idExp: number): Promise<Experience>{
        return this.cvService.findOneExperience(idExp);
    }

    /***********Formation***********/
  @Query(returns => [Formation])
  FindFormations(): Promise<Formation[]>{
      return this.cvService.findAllFormations();
  }

  @Query(returns => Formation)
  FindFormation(@Args('idForm',{type: () => Int}) idForm: number): Promise<Formation>{
      return this.cvService.findOneFormation(idForm);
  }

/***********Langue***********/
@Query(returns => [Langue])
  FindLangues(): Promise<Langue[]>{
      return this.cvService.findAllLangues();
  }

  @Query(returns => Langue)
  FindLangue(@Args('idLang',{type: () => Int}) idLang: number): Promise<Langue>{
      return this.cvService.findOneLangue(idLang);
  }

  /***********Acitvite associative***********/
@Query(returns => [ActiviteAssociative])
FindActs(): Promise<ActiviteAssociative[]>{
    return this.cvService.findAllActs();
}

@Query(returns => ActiviteAssociative)
FindAct(@Args('idAct',{type: () => Int}) idAct: number): Promise<ActiviteAssociative>{
    return this.cvService.findOneAct(idAct);
}
  
}
