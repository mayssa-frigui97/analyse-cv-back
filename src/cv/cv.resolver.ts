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
import { UpdateCertifInput } from './dto/update-certif-input';
import { UpdateActAssocInput } from './dto/update-act-assoc-input';
import { UpdateLangueInput } from './dto/update-langue-input';
import { UpdateExperienceInput } from './dto/update-experience-input';
import { UpdateCompetenceInput } from './dto/update-competence-input';
import { UpdateFormationInput } from './dto/update-formation-input';

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

  @Query(() => [Cv], { name: 'findPostes' })
  findPostes() {
    return this.cvService.findPostes();
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

  @Mutation(() => Certificat)
  updateCertif(
    @Args('idCertif', { type: () => Int }) idCertif: number,
    @Args('updateCertifInput') updateCertifInput: UpdateCertifInput,
  ) {
    return this.cvService.updateCertif(idCertif, updateCertifInput);
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

  @Mutation(() => Competence)
  updateCompetence(
    @Args('idCompetence', { type: () => Int }) idCompetence: number,
    @Args('updateCompetenceInput') updateCompetenceInput: UpdateCompetenceInput,
  ) {
    return this.cvService.updateCompetence(idCompetence, updateCompetenceInput);
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

  @Mutation(() => Experience)
  updateExperience(
    @Args('idExperience', { type: () => Int }) idExperience: number,
    @Args('updateExperienceInput') updateExperienceInput: UpdateExperienceInput,
  ) {
    return this.cvService.updateExperience(idExperience, updateExperienceInput);
  }

  /***********Formation***********/
  @Query((returns) => [Formation])
  findUniversites(): Promise<Formation[]> {
    return this.cvService.findUniverFormations();
  }

  @Query((returns) => [Formation])
  findSpecialites(): Promise<Formation[]> {
    return this.cvService.findSpecFormations();
  }

  @Query((returns) => [Formation])
  findNivFormations(): Promise<Formation[]> {
    return this.cvService.findNivFormations();
  }

  @Query((returns) => Formation)
  findFormation(
    @Args('idForm', { type: () => Int }) idForm: number,
  ): Promise<Formation> {
    return this.cvService.findOneFormation(idForm);
  }

  @Mutation(() => Formation)
  updateFormation(
    @Args('idFormation', { type: () => Int }) idFormation: number,
    @Args('updateFormationInput') updateFormationInput: UpdateFormationInput,
  ) {
    return this.cvService.updateFormation(idFormation, updateFormationInput);
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

  @Mutation(() => Langue)
  updateLangue(
    @Args('idLangue', { type: () => Int }) idLangue: number,
    @Args('updateLangueInput') updateLangueInput: UpdateLangueInput,
  ) {
    return this.cvService.updateLangue(idLangue, updateLangueInput);
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

  @Mutation(() => ActiviteAssociative)
  updateAct(
    @Args('idAct', { type: () => Int }) idAct: number,
    @Args('updateActAssocInput') updateActAssocInput: UpdateActAssocInput,
  ) {
    return this.cvService.updateAct(idAct, updateActAssocInput);
  }

  @Query((returns) => Boolean)
  getCvsMail():Promise<boolean> {
    return this.cvService.getCvsMail();
  }

  // @Query((returns) => Boolean)
  // extractCv(@Args('cv', { type: () => String }) cv: string):Promise<boolean> {
  //   return this.cvService.extractCv(cv);
  // }

  @Query((returns) => Boolean)
  extractCv():Promise<boolean> {
    return this.cvService.extractCv();
  }

  @Query((returns) => Boolean)
  getTextPdf():Promise<boolean> {
    return this.cvService.getTextPdf();
  }

  @Query((returns) => Boolean)
  addCvs():Promise<boolean> {
    return this.cvService.addCvs();
  }
}
