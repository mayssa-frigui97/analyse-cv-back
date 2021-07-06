/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Equipe } from './entities/equipe.entity';
import { Pole } from './entities/pole.entity';
import { CreateColInput } from './Dto/create.col.input';
import { CollaborateurService, Count } from './collaborateur.service';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Collaborateur } from './entities/collaborateur.entity';
import { UpdateColInput } from './Dto/update.col.input';
import { CreatePoleInput } from './Dto/create.pole.input';
import { FilterInput } from './Dto/filter.input';
import { UserRole } from './../enum/UserRole';
import { isNullableType } from 'graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { authGuard } from './../auth/Guards/auth.guard';
import { Roles } from './../decorators/role.decorator';
import { RolesGuard } from './../auth/Guards/role.guard';

@Resolver((of) => Collaborateur)
export class CollaborateurResolver {
  constructor(private collaborateurService: CollaborateurService) {}

  /*************Requests ElasticSearch********** */

  @Query((returns) => Boolean)
  createIndexCol(): Promise<boolean> {
    return this.collaborateurService.createIndex();
  }

  @Query((returns) => Boolean) //fonctionnelle
  createDataCol(): Promise<boolean> {
    return this.collaborateurService.createData();
  }

  @Query((returns) => [Collaborateur])
  searchCol(@Args('mot') mot: string): Promise<Collaborateur[]> {
    return this.collaborateurService.search(mot);
  }

  @Query((returns) => [Collaborateur])
  searchEquipe(
    @Args('mot') mot: string,
    @Args('equipe') equipe: string
    ): Promise<Collaborateur[]> {
    return this.collaborateurService.searchEquipe(mot,equipe);
  }

  @Query((returns) => [Collaborateur])
  searchPole(
    @Args('mot') mot: string,
    @Args('pole') pole: string
    ): Promise<Collaborateur[]> {
    return this.collaborateurService.searchPole(mot,pole);
  }

  /***********Colaborateur***********/

  @Query((returns) => [Collaborateur])
  @UseGuards(authGuard,RolesGuard)
  @Roles(UserRole.RH, UserRole.RP, UserRole.TEAMLEADER)
  findCols(
    @Args('pole', { type: () => Int, nullable: true }) pole?: number,
    @Args('equipe', { type: () => Int, nullable: true }) equipe?: number,
  ): Promise<Collaborateur[]> {
    return this.collaborateurService.findAllCols(pole,equipe);
  }

  @Query((returns) => Collaborateur, { nullable: true })
  @UseGuards(authGuard,RolesGuard)
  @Roles(UserRole.COLLABORATEUR,UserRole.RH, UserRole.RP, UserRole.TEAMLEADER)
  findCol(
    @Args('idCol', { type: () => Int }) idCol: number,
  ): Promise<Collaborateur> {
    return this.collaborateurService.findOneCol(idCol);
  }

  @Mutation((returns) => Collaborateur)
  createCol(
    @Args('createColInput') createColInput: CreateColInput,
  ): Promise<Collaborateur> {
    return this.collaborateurService.createCol(createColInput);
  }

  @Mutation(() => Collaborateur)
  updateCol(
    @Args('idCol', { type: () => Int }) id: number,
    @Args('updateColInput') updateColInput: UpdateColInput,
  ) {
    return this.collaborateurService.updateCol(id, updateColInput);
  }

  @Mutation(() => Collaborateur)
  updateColEquipe(
    @Args('idCol', { type: () => Int }) id: number,
    @Args('equipeId', { type: () => Int }) equipeId: number,
  ) {
    return this.collaborateurService.updateColEquipe(id,equipeId);
  }

  @Mutation(() => Collaborateur)
  updateRole(
    @Args('idCol', { type: () => Int }) id: number,
    @Args('role', { type: () => UserRole }) role: UserRole,
  ) {
    return this.collaborateurService.updateRole(id, role);
  }

  @Mutation(() => Boolean)
  @UseGuards(authGuard,RolesGuard)
  @Roles(UserRole.RH)
  removeCol(@Args('idCol', { type: () => Int }) idCol: number) {
    const supp = this.collaborateurService.removeCol(idCol);
    return supp;
  }

  @Query((returns) => [Collaborateur])
  @UseGuards(authGuard,RolesGuard)
  @Roles(UserRole.RH, UserRole.RP, UserRole.TEAMLEADER)
  findFilterCols(
    @Args('selectedPoles', { type: () => [Int], nullable: true })
    selectedPoles?: number[],
    @Args('selectedEquipes', { type: () => [Int], nullable: true })
    selectedEquipes?: number[],
    @Args('selectedPoste', { type: () => [String], nullable: true })
    selectedPoste?: string[],
    @Args('selectedComp', { type: () => [String], nullable: true })
    selectedComp?: string[],
  ): Promise<Collaborateur[]> {
    return this.collaborateurService.getFilterCols(
      selectedPoles,
      selectedEquipes,
      selectedPoste,
      selectedComp,
    );
  }

  @Query((returns) => [Collaborateur])
  // @Roles(UserRole.RH, UserRole.ADMIN, UserRole.RP, UserRole.TEAMLEADER)
  findFilteredCols(
    @Args('filterInput', { type: () => FilterInput }) filterInput: FilterInput,
  ): Promise<Collaborateur[]> {
    return this.collaborateurService.getFilteredCols(filterInput);
  }

  @Query((returns) => [Collaborateur])
  @UseGuards(authGuard,RolesGuard)
  @Roles(UserRole.RH)
  findFilterUsers(
    @Args('selectedRoles', { type: () => [UserRole], nullable: true })
    selectedRoles?: UserRole[],
  ): Promise<Collaborateur[]> {
    return this.collaborateurService.getFilterUsers(selectedRoles);
  }

  // @ResolveField(returns => Equipe)
  // async findEquipeCol(@Parent() collaborateur: Collaborateur) {
  //   return this.collaborateurService.findOneEquipe(collaborateur.equipeId);
  // }

  /***********Pole***********/
  @Query((returns) => [Pole])
  // @Roles(UserRole.RH, UserRole.ADMIN, UserRole.RP)
  findPoles(): Promise<Pole[]> {
    return this.collaborateurService.findAllPoles();
  }

  @Query((returns) => Pole)
  findPole(@Args('idPole', { type: () => Int }) idPole: number): Promise<Pole> {
    return this.collaborateurService.findOnePole(idPole);
  }

  @Mutation((returns) => Pole)
  createPole(
    @Args('createPoleInput') createPoleInput: CreatePoleInput,
  ): Promise<Pole> {
    return this.collaborateurService.createPole(createPoleInput);
  }

  @Mutation((returns) => Pole)
  updateRp(
    @Args('poleId', { type: () => Int }) poleId: number,
    @Args('rpId', { type: () => Int }) rpId: number,
  ): Promise<Pole> {
    return this.collaborateurService.updateRpPole(poleId,rpId);
  }

  @Query((returns) => Pole)
  findPoleRp(@Args('rpId', { type: () => Int }) rpId: number): Promise<Pole> {
    return this.collaborateurService.findPoleRp(rpId);
  }

  /***********Equipe***********/
  @Query((returns) => [Equipe])
  // @Roles(UserRole.RH,UserRole.ADMIN,UserRole.RP)
  findEquipes(): Promise<Equipe[]> {
    return this.collaborateurService.findAllEquipes();
  }

  @Query((returns) => Equipe)
  findEquipe(
    @Args('idEquipe', { type: () => Int }) idEquipe: number,
  ): Promise<Equipe> {
    return this.collaborateurService.findOneEquipe(idEquipe);
  }

  @Query((returns) => [Equipe])
  findEquipesPole(
    @Args('idPoles', { type: () => [Int] ,nullable: true}) idPoles?: number[],
  ): Promise<Equipe[]> {
    return this.collaborateurService.findEquipesPoles(idPoles);
  }

  @Query(() => [Collaborateur], { name: 'findPostes' })
  findPostes(
    @Args('pole', { type: () => Int, nullable: true }) pole?: number,
    @Args('equipe', { type: () => Int, nullable: true }) equipe?: number
  ) {
    return this.collaborateurService.findPostes(pole,equipe);
  }

  @Query(() => [Collaborateur], { name: 'findRoles' })
  findRoles() {
    return this.collaborateurService.findRoles();
  }

  @Mutation((returns) => Equipe)
  updateTl(
    @Args('equipeId', { type: () => Int }) equipeId: number,
    @Args('tlId', { type: () => Int }) tlId: number,
  ): Promise<Equipe> {
    return this.collaborateurService.updateTlEquipe(equipeId,tlId);
  }

  /***********Statistique***********/

  @Query(() => Int)
  CountColsEquipe(
    @Args('equipe', { type: () => Int}) equipe: number
  ) {
    return this.collaborateurService.colEquipe(equipe);
  }

  @Query(() => Int)
  CountColsPole(
    @Args('pole', { type: () => Int}) pole: number
  ) {
    return this.collaborateurService.colPole(pole);
  }

  @Query(() => [Count])
  CountColsEquipes() {
    return this.collaborateurService.countColsEquipes();
  }

  @Query(() => [Count])
  CountColsPoles() {
    return this.collaborateurService.countColsPoles();
  }
}
