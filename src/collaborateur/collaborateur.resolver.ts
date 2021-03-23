import { Equipe } from './entities/equipe.entity';
import { Pole } from './entities/pole.entity';
import { CreateColInput } from './Dto/create.col.input';
import { CollaborateurService } from './collaborateur.service';
import { Resolver,Query, Mutation, Args, Int, Parent, ResolveField } from "@nestjs/graphql";
import { Collaborateur } from './entities/collaborateur.entity';
import { UpdateColInput } from './Dto/update.col.input';
import { CreatePoleInput } from './Dto/create.pole.input';

@Resolver(of => Collaborateur)
export class CollaborateurResolver{
    constructor(private collaborateurService: CollaborateurService) {}

    /***********Colaborateur***********/
    @Query(returns => [Collaborateur])
    FindCols(@Args('pole',{type: () => Int, nullable: true}) pole?: number): Promise<Collaborateur[]>{
        return this.collaborateurService.findAllCol(pole);
    }

    @Query(returns => Collaborateur)
    FindCol(
        @Args('idCol',{type: () => Int}) idCol: number
    ): Promise<Collaborateur>{
        return this.collaborateurService.findOneCol(idCol);
    }

    @Mutation(returns => Collaborateur)
    CreateCol(@Args('createColInput') createColInput: CreateColInput):Promise<Collaborateur>{
        return this.collaborateurService.createCol(createColInput);
    }

    @Mutation(() => Collaborateur)
    UpdateCol(@Args('idCol', { type: () => Int }) id: number, 
    @Args('updateCollaborateurInput') updateColInput: UpdateColInput) {
      return this.collaborateurService.updateCol(id, updateColInput);
    }

    @Mutation(() => Boolean)
    RemoveCol(@Args('idCol', { type: () => Int }) idCol: number){
      var supp=this.collaborateurService.removeCol(idCol);
      return supp;
    }

    // @ResolveField(returns=> Pole)
    // FindPoleOfCols(@Parent() collaborateur: Collaborateur): Promise<Pole>{
    //   return this.collaborateurService.findOnePole(collaborateur.pole.id);
    // }



  /***********Pole***********/
    @Query(returns => [Pole])
    FindPoles(): Promise<Pole[]>{
        return this.collaborateurService.findAllPoles();
    }

    @Query(returns => Pole)
    FindPole(@Args('idPole',{type: () => Int}) idPole: number): Promise<Pole>{
        return this.collaborateurService.findOnePole(idPole);
    }

    @Mutation(returns => Pole)
    CreatePole(@Args('createPoleInput') createPoleInput: CreatePoleInput):Promise<Pole>{
        return this.collaborateurService.createPole(createPoleInput);
    }


  /***********Equipe***********/
  @Query(returns => [Equipe])
    FindEquipes(): Promise<Equipe[]>{
        return this.collaborateurService.findAllEquipes();
    }

    @Query(returns => Equipe)
    FindEquipe(@Args('idEquipe',{type: () => Int}) idEquipe: number): Promise<Equipe>{
        return this.collaborateurService.findOneEquipe(idEquipe);
    }
}