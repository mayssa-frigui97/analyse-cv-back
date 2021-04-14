import { Equipe } from './entities/equipe.entity';
import { Pole } from './entities/pole.entity';
import { CreateColInput } from './Dto/create.col.input';
import { CollaborateurService } from './collaborateur.service';
import { Resolver,Query, Mutation, Args, Int, Parent, ResolveField } from "@nestjs/graphql";
import { Collaborateur } from './entities/collaborateur.entity';
import { UpdateColInput } from './Dto/update.col.input';
import { CreatePoleInput } from './Dto/create.pole.input';

@Resolver((of) => Collaborateur)
export class CollaborateurResolver {
  constructor(
    private collaborateurService: CollaborateurService,
    // private cvService: CvService
    ) {}

  /***********Colaborateur***********/
  @Query((returns) => [Collaborateur])
  findCols(
    @Args('pole', { type: () => Int, nullable: true }) pole?: number,
  ): Promise<Collaborateur[]> {
    return this.collaborateurService.findAllCol(pole);
  }

  @Query((returns) => Collaborateur, { nullable: true })
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

  @Mutation(() => Boolean)
  removeCol(@Args('idCol', { type: () => Int }) idCol: number) {
  var supp = this.collaborateurService.removeCol(idCol);
    return supp;
  }

  @Query((returns) => [Collaborateur])
  findFilterCols(
    @Args('selectedPoles', { type: () => [Int]}) selectedPoles?: number[],
  ): Promise<Collaborateur[]> {
    return this.collaborateurService.getFilterPole(selectedPoles);
  }

  // @ResolveField(returns => Equipe)
  // async findEquipeCol(@Parent() collaborateur: Collaborateur) {
  //   return this.collaborateurService.findOneEquipe(collaborateur.equipeId);
  // }

  /***********Pole***********/
  @Query((returns) => [Pole])
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

  /***********Equipe***********/
  @Query((returns) => [Equipe])
  findEquipes(): Promise<Equipe[]> {
    return this.collaborateurService.findAllEquipes();
  }

  @Query((returns) => Equipe)
  findEquipe(
    @Args('idEquipe', { type: () => Int }) idEquipe: number,
  ): Promise<Equipe> {
    return this.collaborateurService.findOneEquipe(idEquipe);
  }
}