import { Candidature } from './entities/candidature.entity';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { PersonneService } from './personne.service';
import { CreatePersonneInput } from './dto/create-personne.input';
import { Personne } from './entities/personne.entity';
import { UpdatePersonneInput } from './dto/update-personne.input';
import { UseGuards } from '@nestjs/common';
import { authGuard } from './../auth/Guards/auth.guard';
import { RolesGuard } from './../auth/Guards/role.guard';
import { UserRole } from './../enum/UserRole';
import { Roles } from './../decorators/role.decorator';
import { CreateCandidatureInput } from './dto/create-candidature.input';
import { Count } from 'src/collaborateur/collaborateur.service';

@Resolver(() => Personne)
export class PersonneResolver {
  constructor(private readonly personneService: PersonneService) {}

  /*************Requests ElasticSearch********** */

  @Query((returns) => Boolean)
  createIndex(): Promise<boolean> {
    return this.personneService.createIndex();
  }

  @Query((returns) => Boolean) //fonctionnelle
  createData(): Promise<boolean> {
    return this.personneService.createData();
  }

  // @Query((returns) => [Personne])
  // searchFormation(@Args('formation') formation: string):Promise<Personne[]> {
  //   return this.personneService.searchFormation(formation);
  // }

  @Query((returns) => [Personne])
  @UseGuards(authGuard, RolesGuard)
  @Roles(UserRole.RH, UserRole.RP, UserRole.TEAMLEADER)
  search(@Args('mot') mot: string): Promise<Personne[]> {
    return this.personneService.search(mot);
  }

  /**********Personne***********/
  @Mutation(() => Boolean)
  @UseGuards(authGuard, RolesGuard)
  @Roles(UserRole.RH, UserRole.RP, UserRole.TEAMLEADER)
  updateRecommande(
    @Args('idPersonne', { type: () => Int }) idPersonne: number,
    @Args('value', { type: () => Boolean }) value: boolean,
  ) {
    return this.personneService.changeRecommande(idPersonne, value);
  }

  @Mutation(() => Personne)
  createPersonne(
    @Args('createPersonneInput') createPersonneInput: CreatePersonneInput,
  ) {
    return this.personneService.createPersonne(createPersonneInput);
  }

  @Query(() => [Personne], { name: 'findPersonnes' })
  @UseGuards(authGuard, RolesGuard)
  @Roles(UserRole.RH, UserRole.RP, UserRole.TEAMLEADER)
  findAllPersonnes() {
    return this.personneService.findAllPersonnes();
  }

  @Query(() => Personne, { name: 'findPersonne' })
  // @UseGuards(authGuard, RolesGuard)
  // @Roles(UserRole.RH, UserRole.RP, UserRole.TEAMLEADER)
  findOnePersonne(@Args('idPersonne', { type: () => Int }) id: number) {
    return this.personneService.findOnePersonne(id);
  }

  @Query(() => [Personne], { name: 'findPersonnesId' })
  findPersonneIds(
    @Args('ids1', { type: () => [Int], nullable: true }) ids1?: number[],
    @Args('ids2', { type: () => [Int], nullable: true }) ids2?: number[],
  ) {
    return this.personneService.findPersonnesId(ids1, ids2);
  }

  @Mutation(() => Personne)
  updatePersonne(
    @Args('idPersonne', { type: () => Int }) id: number,
    @Args('updatePersonneInput') updatePersonneInput: UpdatePersonneInput,
  ) {
    return this.personneService.updatePersonne(id, updatePersonneInput);
  }

  @Mutation(() => Boolean)
  // @UseGuards(authGuard, RolesGuard)
  // @Roles(UserRole.RH)
  removePersonne(@Args('idPersonne', { type: () => Int }) id: number) {
    const supp = this.personneService.removePersonne(id);
    return supp;
  }

  @Mutation(() => Boolean)
  @UseGuards(authGuard, RolesGuard)
  @Roles(UserRole.RH)
  removeCandidat(@Args('idCand', { type: () => Int }) idCand: number) {
    const supp = this.personneService.removeCand(idCand);
    return supp;
  }

  @Mutation(() => Personne)
  restorePersonne(@Args('idPersonne', { type: () => Int }) id: number) {
    return this.personneService.restorePersonne(id);
  }

  @Query((returns) => [Personne])
  @UseGuards(authGuard, RolesGuard)
  @Roles(UserRole.RH, UserRole.RP, UserRole.TEAMLEADER)
  findFilterCands(
    // @Args('selectedNiv', { type: () => [String],nullable:true}) selectedNiv?: string[],
    // @Args('selectedSpec', { type: () => [String],nullable:true}) selectedSpec?: string[],
    // @Args('selectedUniver', { type: () => [String],nullable:true}) selectedUniver?: string[],
    @Args('selectedComp', { type: () => [String], nullable: true })
    selectedComp?: string[],
  ): Promise<Personne[]> {
    return this.personneService.getFilterCand(selectedComp);
  }

  /**********Candidature**********/
  @Query(() => [Candidature], { name: 'findCandidatures' })
  findAllCandidatures() {
    return this.personneService.findAllcandidatures();
  }

  @Query(() => Candidature, { name: 'findCandidature' })
  findOneCandidature(
    @Args('idCandidature', { type: () => Int }) idCandidature: number,
  ) {
    return this.personneService.findOnecandidature(idCandidature);
  }

  @Mutation(() => Candidature)
  createCandidature(
    @Args('createCandidatureInput')
    createCandidatureInput: CreateCandidatureInput,
  ) {
    return this.personneService.createCandidature(createCandidatureInput);
  }

  /***************Statistique*********/
  @Query(() => [Count])
  CountFormation() {
    return this.personneService.countFormation();
  }
}
