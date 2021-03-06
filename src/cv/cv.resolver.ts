import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CvService, Liste, Result } from './cv.service';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { Personne } from '../candidat/entities/personne.entity';
import { Competence } from './entities/competence.entity';
import { UpdateCompetenceInput } from './dto/update-competence.input';
import { CreateCompetenceInput } from './dto/create-competence.input';
import { createReadStream, createWriteStream } from 'fs';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Upload } from './upload';
import { Candidature } from 'src/candidat/entities/candidature.entity';
import { StatutCV } from 'src/enum/StatutCV';
import { Count } from 'src/collaborateur/collaborateur.service';

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
  findOneCv(@Args('idCv', { type: () => Int }) idCV: number) {
    return this.cvService.findOneCV(idCV);
  }

  @Mutation(() => Cv)
  updateCv(
    @Args('idCv', { type: () => Int }) idCV: number,
    @Args('updateCvInput') updateCvInput: UpdateCvInput,
  ) {
    return this.cvService.updateCV(idCV, updateCvInput);
  }

  @Mutation(() => Cv)
  updateStatutCv(
    @Args('idCv', { type: () => Int }) idCV: number,
    @Args('statut', { type: () => StatutCV }) statut: StatutCV,
  ) {
    return this.cvService.updateStatutCv(idCV, statut);
  }

  @Mutation(() => Boolean)
  removeCv(@Args('idCv', { type: () => Int }) idCV: number) {
    const supp = this.cvService.removeCV(idCV);
    return supp;
  }

  @Query(() => [Cv], { name: 'findCompetences' })
  findCompetences() {
    return this.cvService.findCompetences();
  }

  @ResolveField((returns) => Cv)
  async CvPersonne(@Parent() personne: Personne) {
    return this.cvService.findOneCV(personne.cvId);
  }

  /***********EXTRACT CV**************/

  @Query((returns) => Boolean)
  getCvs(): Promise<boolean> {
    return this.cvService.getCvs();
  }

  @Query((returns) => Liste)
  getCvsMail(): Promise<Liste> {
    return this.cvService.getCvsMail();
  }

  @Query((returns) => Boolean)
  extractCvs(
    @Args('listeFiles', { type: () => [String] }) liste: string[],
  ): Promise<boolean> {
    return this.cvService.extractCvs(liste);
  }

  @Query((returns) => Boolean)
  extractOneCv(@Args('file') file: string): Promise<boolean> {
    return this.cvService.extractOneCv(file);
  }

  @Query((returns) => Boolean)
  addCvs(
    @Args('listeFiles', { type: () => [String] }) liste: string[],
  ): Promise<boolean> {
    return this.cvService.addCvs(liste);
  }

  @Query((returns) => String)
  ReturnMsg(): Promise<Candidature> {
    return this.cvService.AddCandidature();
  }

  @Mutation(() => Boolean)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: Upload,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`./${filename}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );
  }

  /******************competence********** */

  @Mutation(() => Competence)
  createCompetence(
    @Args('createCompetenceInput') createCompetenceInput: CreateCompetenceInput,
  ) {
    return this.cvService.createCompetences(createCompetenceInput);
  }

  @Query((returns) => [Competence])
  findAllCompetences(): Promise<Competence[]> {
    return this.cvService.findAllCompetences();
  }

  @Query((returns) => [Competence])
  findCompetencesCols(): Promise<Competence[]> {
    return this.cvService.findCompetencesCols();
  }

  @Query((returns) => [Competence])
  findCompetencesCandidats(): Promise<Competence[]> {
    return this.cvService.findCompetencesCandidats();
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

  @Mutation(() => Boolean)
  removeCompetence(@Args('idComp', { type: () => Int }) idComp: number) {
    const supp = this.cvService.removeCompetence(idComp);
    return supp;
  }

  /***************Statistique*********/
  @Query(() => [Count])
  CountCompetences() {
    return this.cvService.countCompetences();
  }
}
