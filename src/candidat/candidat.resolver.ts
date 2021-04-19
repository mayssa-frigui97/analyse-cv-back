import { Candidature } from './entities/candidature.entity';
import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { CandidatService } from './candidat.service';
import { Candidat } from './entities/candidat.entity';
import { CreateCandidatInput } from './dto/create-candidat.input';
import { UpdateCandidatInput } from './dto/update-candidat.input';
import { Cv } from 'src/cv/entities/cv.entity';
import { CvService } from './../cv/cv.service';

@Resolver(() => Candidat)
export class CandidatResolver {
  constructor(
    private readonly candidatService: CandidatService) {}

  /**********Candidat***********/
  @Mutation(() => Candidat)
  createCandidat(@Args('createCandidatInput') createCandidatInput: CreateCandidatInput) {
    return this.candidatService.createCandidat(createCandidatInput);
  }

  @Query(() => [Candidat], { name: 'findCandidats' })
  findAllCandidats() {
    return this.candidatService.findAllCandidat();
  }

  @Query(() => Candidat, { name: 'findCandidat' })
  findOneCandidat(@Args('idCand', { type: () => Int }) id: number) {
    return this.candidatService.findOneCandidat(id);
  }

  @Mutation(() => Candidat)
  updateCandidat(
    @Args('idCandidat', { type: () => Int }) id: number,
    @Args('updateCandidatInput') updateCandidatInput: UpdateCandidatInput) {
    return this.candidatService.updateCandidat(id, updateCandidatInput);
  }

  @Mutation(() => Boolean)
  removeCandidat(@Args('idCand', { type: () => Int }) id: number) {
    var supp=this.candidatService.removeCandidat(id);
    return supp;
  }

  @Mutation(() => Candidat)
  restoreCandidat(@Args('idCand', { type: () => Int }) id: number) {
    return this.candidatService.restoreCandidat(id);
  }

  @Query((returns) => [Candidat])
  findFilterCands(
    @Args('selectedNiv', { type: () => [String],nullable:true}) selectedNiv?: string[],
    @Args('selectedSpec', { type: () => [String],nullable:true}) selectedSpec?: string[],
    @Args('selectedUniver', { type: () => [String],nullable:true}) selectedUniver?: string[],
    @Args('selectedPoste', { type: () => [String],nullable:true}) selectedPoste?: string[],
    @Args('selectedComp', { type: () => [String],nullable:true}) selectedComp?: string[]
  ): Promise<Candidat[]> {
    return this.candidatService.getFilterCand(selectedNiv,selectedSpec,selectedUniver,selectedPoste,selectedComp);
  }

  /**********Candidature**********/
  @Query(() => [Candidature], { name: 'findCandidatures' })
  findAllCandidatures() {
    return this.candidatService.findAllCandidatures();
  }

  @Query(() => Candidature, { name: 'findCandidature' })
  findOneCandidature(@Args('idCandidature', { type: () => Int }) idCandidature: number) {
    return this.candidatService.findOneCandidature(idCandidature);
  }

  // @ResolveField((returns)=>Cv)
  // findCv(@Parent() candidature: Candidature):Promise<Cv>{
  //   return this.candidatService.findCv(candidature.cv.id)
  // }
}
