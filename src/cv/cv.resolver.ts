import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { Personne } from '../candidat/entities/personne.entity';
import { Competence } from './entities/competence.entity';
import { UpdateCompetenceInput } from './dto/update-competence.input';
import { CreateCompetenceInput } from './dto/create-competence.input';
import { createReadStream, createWriteStream } from 'fs';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

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

  @Query(() => Cv, { name: 'findCvPersonne' })
  findCvPersonne(@Args('idPersonne', { type: () => Int }) idPersonne: number) {
    return this.cvService.findCvPersonne(idPersonne);
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

  @Query(() => [Cv], { name: 'findCompetences' })
  findCompetences() {
    return this.cvService.findCompetences();
  }

  @ResolveField(returns => Cv)
  async CvPersonne(@Parent() personne: Personne) {
    return this.cvService.findOneCV(personne.cvId);
  }

  /***********EXTRACT CV**************/

  @Query((returns) => Boolean)
  getCvsMail():Promise<boolean> {
    return this.cvService.getCvsMail();
  }
  
  @Query((returns) => Boolean)
  extractCv():Promise<boolean> {
    return this.cvService.extractCv();
  }
  
  @Query((returns) => Boolean)
  extractOneCv(@Args('file') file: string):Promise<boolean> {
    return this.cvService.extractOneCv(file);
  }
  
  @Query((returns) => Boolean)
  getTextPdf():Promise<boolean> {
    return this.cvService.getTextPdf();
  }
  
  @Query((returns) => Boolean)
  addCvs():Promise<boolean> {
    return this.cvService.addCvs();
  }

  @Mutation(() => Boolean)
  async uploadSigleFile(
    @Args({ type: () => GraphQLUpload, name: 'upload', nullable: true })
    upload: FileUpload,
  ) {
    console.log(upload.filename, upload.mimetype);
    return true;
  }

  // @Query((returns) => Boolean)
  // bdToJson():Promise<boolean> {
  //   return this.cvService.bdToJson();
  // }

  //   @Query((returns) => String)
  //   getAvatar(@Args('email') email: string):Promise<String> {
  //     return this.cvService.getAvatar(email);
  // }

  //******************competence********** */

  @Mutation(() => Competence)
  createCompetence(@Args('createCompetenceInput') createCompetenceInput: CreateCompetenceInput) {
    return this.cvService.createCompetences(createCompetenceInput);
  }

  @Query((returns) => [Competence])
  findAllCompetences(): Promise<Competence[]> {
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

}
