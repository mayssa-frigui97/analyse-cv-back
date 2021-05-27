import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { Personne } from '../candidat/entities/personne.entity';

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
  getTextPdf():Promise<boolean> {
    return this.cvService.getTextPdf();
  }
  
  @Query((returns) => Boolean)
  addCvs():Promise<boolean> {
    return this.cvService.addCvs();
  }
  
    @Query((returns) => String)
    getAvatar(@Args('email') email: string):Promise<String> {
      return this.cvService.getAvatar(email);
  }
}
