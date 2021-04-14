import { ActiviteAssociative } from './entities/activite.associative.entity';
import { Experience } from './entities/experience.entity';
import { Competence } from './entities/competence.entity';
import { Certificat } from './entities/certificat.entity';
import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { Formation } from './entities/formation.entity';
import { Langue } from './entities/langue.entity';
import { Personne } from '../candidat/entities/personne.entity';
import { Candidat } from './../candidat/entities/candidat.entity';
import { Collaborateur } from 'src/collaborateur/entities/collaborateur.entity';

@Resolver(() => Cv)
export class CvResolver {
  constructor(private readonly cvService: CvService) {}

  /***********CV**************/

  @Mutation(() => Cv)
  createCv(@Args('createCvInput') createCvInput: CreateCvInput) {
    return this.cvService.createCV(createCvInput);
  }

  @Query(() => [Cv], { name: 'findCvs' })
  findAllCVs() {
    return this.cvService.findAllCVs();
  }

  @Query(() => Cv, { name: 'findCv' })
  findOneCV(@Args('idCv', { type: () => Int }) idCV: number) {
    return this.cvService.findOneCV(idCV);
  }

  @Query(() => Cv, { name: 'findCvCandidat' })
  findCvCandidat(@Args('idCand', { type: () => Int }) idCand: number) {
    return this.cvService.findCvCandidat(idCand);
  }

  @Mutation(() => Cv)
  updateCv(
    @Args('idCv', { type: () => Int }) idCV: number,
    @Args('updateCvInput') updateCvInput: UpdateCvInput,
  ) {
    return this.cvService.updateCV(idCV, updateCvInput);
  }

  @Mutation(() => Boolean)
  removeCv(@Args('idCv', { type: () => Int }) idCV: number) {
    var supp = this.cvService.removeCV(idCV);
    return supp;
  }

  @ResolveField(returns => Cv)
  async findCvPersonne(@Parent() personne: Personne) {
    return this.cvService.findOneCV(personne.cvId);
  }
  // @ResolveField(returns => Cv)
  // async findCvCandidat(@Parent() candidat: Candidat) {
  //   return this.cvService.findOneCV(candidat.cvId);
  // }

  // @ResolveField(returns => Cv)
  // async findCvCol(@Parent() col: Collaborateur) {
  //   return this.cvService.findOneCV(col.cvId);
  // }

  /***********Certificat**************/
  @Query((returns) => [Certificat])
  findCertificats(): Promise<Certificat[]> {
    return this.cvService.findAllCertificats();
  }

  @Query((returns) => Certificat)
  findCertificat(
    @Args('idCertif', { type: () => Int }) idCertif: number,
  ): Promise<Certificat> {
    return this.cvService.findOneCertificat(idCertif);
  }

  /***********Competence***********/
  @Query((returns) => [Competence])
  findCompetences(): Promise<Competence[]> {
    return this.cvService.findAllCompetences();
  }

  @Query((returns) => Competence)
  findCompetence(
    @Args('idComp', { type: () => Int }) idComp: number,
  ): Promise<Competence> {
    return this.cvService.findOneCompetence(idComp);
  }

  /***********Experience***********/
  @Query((returns) => [Experience])
  findExperiences(): Promise<Experience[]> {
    return this.cvService.findAllExperiences();
  }

  @Query((returns) => Experience)
  findExperience(
    @Args('idExp', { type: () => Int }) idExp: number,
  ): Promise<Experience> {
    return this.cvService.findOneExperience(idExp);
  }

  @Query((returns) => [Experience])
  findExperiencesCv(
    @Args('idCv', { type: () => Int }) idCv: number,
  ): Promise<Experience[]> {
    return this.cvService.findExperienceCv(idCv);
  }

  /***********Formation***********/
  @Query((returns) => [Formation])
  findFormations(): Promise<Formation[]> {
    return this.cvService.findAllFormations();
  }

  @Query((returns) => Formation)
  findFormation(
    @Args('idForm', { type: () => Int }) idForm: number,
  ): Promise<Formation> {
    return this.cvService.findOneFormation(idForm);
  }

  /***********Langue***********/
  @Query((returns) => [Langue])
  findLangues(): Promise<Langue[]> {
    return this.cvService.findAllLangues();
  }

  @Query((returns) => Langue)
  findLangue(
    @Args('idLang', { type: () => Int }) idLang: number,
  ): Promise<Langue> {
    return this.cvService.findOneLangue(idLang);
  }

  /***********Acitvite associative***********/
  @Query((returns) => [ActiviteAssociative])
  findActs(): Promise<ActiviteAssociative[]> {
    return this.cvService.findAllActs();
  }

  @Query((returns) => ActiviteAssociative)
  findAct(
    @Args('idAct', { type: () => Int }) idAct: number,
  ): Promise<ActiviteAssociative> {
    return this.cvService.findOneAct(idAct);
  }
}
