import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EntretienService } from './entretien.service';
import { Entretien } from './entities/entretien.entity';

@Resolver(() => Entretien)
export class EntretienResolver {
  constructor(private entretienService: EntretienService) {}

  /**********Entretien************/

  @Query(() => [Entretien], { name: 'findEntretiens' })
  findAllEntretiens() {
    return this.entretienService.findAllEntretiens();
  }

  @Query(() => Entretien, { name: 'findEntretien' })
  findOneEntretien(@Args('idEnt', { type: () => Int }) id: number) {
    return this.entretienService.findOneEntretien(id);
  }

}
