import { Candidature } from './entities/candidature.entity';
import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { CandidatService } from './candidat.service';
import { Candidat } from './entities/candidat.entity';
import { CreateCandidatInput } from './dto/create-candidat.input';
import { UpdateCandidatInput } from './dto/update-candidat.input';
import { Cv } from 'src/cv/entities/cv.entity';

@Resolver(() => Candidat)
export class CandidatResolver {
  constructor(private readonly candidatService: CandidatService) {}

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

  /**********Candidature**********/
  @Query(() => [Candidature], { name: 'findCandidatures' })
  findAllCandidatures() {
    return this.candidatService.findAllCandidatures();
  }

  @Query(() => Candidature, { name: 'findCandidature' })
  findOneCandidature(@Args('id', { type: () => Int }) id: number) {
    return this.candidatService.findOneCandidature(id);
  }

  // @ResolveField((returns)=>Cv)
  // findCv(@Parent() candidature: Candidature):Promise<Cv>{
  //   return this.candidatService.findCv(candidature.cv.id)
  // }
}
