import { Candidature } from './entities/candidature.entity';
import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { PersonneService } from './personne.service';
import { CreatePersonneInput } from './dto/create-personne.input';
import { Personne } from './entities/personne.entity';
import { UpdatePersonneInput } from './dto/update-personne.input';

@Resolver(() => Personne)
export class PersonneResolver {
  constructor(
    private readonly personneService: PersonneService) {}

  /**********Personne***********/
  // @Mutation(() => [Personne])
  // updateRecommande(@Args('idPersonne',{ type: () => Int }) idPersonne: number,
  // @Args('value',{ type: () => Boolean }) value: boolean) {
  //   return this.personneService.changeRecommande(idPersonne,value);
  // }

  @Mutation(() => Boolean)
  updateRecommande(@Args('idPersonne',{ type: () => Int }) idPersonne: number,
  @Args('value',{ type: () => Boolean }) value: boolean) {
    return this.personneService.changeRecommande(idPersonne,value);
  }

  @Mutation(() => Personne)
  createPersonne(@Args('createPersonneInput') createPersonneInput: CreatePersonneInput) {
    return this.personneService.createPersonne(createPersonneInput);
  }

  @Query(() => [Personne], { name: 'findPersonnes' })
  findAllPersonnes() {
    return this.personneService.findAllPersonnes();
  }

  @Query(() => Personne, { name: 'findPersonne' })
  findOnePersonne(@Args('idPersonne', { type: () => Int }) id: number) {
    return this.personneService.findOnePersonne(id);
  }

  @Mutation(() => Personne)
  updatePersonne(
    @Args('idPersonne', { type: () => Int }) id: number,
    @Args('updatePersonneInput') updatePersonneInput: UpdatePersonneInput) {
    return this.personneService.updatePersonne(id, updatePersonneInput);
  }

  @Mutation(() => Boolean)
  removePersonne(@Args('idPersonne', { type: () => Int }) id: number) {
    var supp=this.personneService.removePersonne(id);
    return supp;
  }

  @Mutation(() => Personne)
  restorePersonne(@Args('idPersonne', { type: () => Int }) id: number) {
    return this.personneService.restorePersonne(id);
  }

  @Query((returns) => [Personne])
  findFilterCands(
    // @Args('selectedNiv', { type: () => [String],nullable:true}) selectedNiv?: string[],
    // @Args('selectedSpec', { type: () => [String],nullable:true}) selectedSpec?: string[],
    // @Args('selectedUniver', { type: () => [String],nullable:true}) selectedUniver?: string[],
    @Args('selectedComp', { type: () => [String],nullable:true}) selectedComp?: string[]
  ): Promise<Personne[]> {
    return this.personneService.getFilterCand(selectedComp);
  }

  /**********Personneure**********/
  @Query(() => [Candidature], { name: 'findCandidatures' })
  findAllCandidatures() {
    return this.personneService.findAllcandidatures();
  }

  @Query(() => Candidature, { name: 'findCandidature' })
  findOneCandidature(@Args('idCandidature', { type: () => Int }) idCandidature: number) {
    return this.personneService.findOnecandidature(idCandidature);
  }

  // @ResolveField((returns)=>Cv)
  // findCv(@Parent() Personneure: Personneure):Promise<Cv>{
  //   return this.personneService.findCv(Personneure.cv.id)
  // }
}
