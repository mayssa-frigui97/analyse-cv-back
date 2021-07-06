/* eslint-disable prettier/prettier */
import { Equipe } from './entities/equipe.entity';
import { UpdateColInput } from './Dto/update.col.input';
import { CreateColInput } from './Dto/create.col.input';
import { Collaborateur } from './entities/collaborateur.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pole } from './entities/pole.entity';
import { CreatePoleInput } from './Dto/create.pole.input';
import { Cv } from './../cv/entities/cv.entity';
import { FilterInput } from './Dto/filter.input';
import { UserRole } from './../enum/UserRole';
import { response } from 'express';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { UpdatePoleInput } from './Dto/update-pole.input';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const elasticsearch = require('elasticsearch');

//require the Elasticsearch librray
// eslint-disable-next-line @typescript-eslint/no-var-requires
// instantiate an Elasticsearch client
const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200'],
});

@ObjectType()
export class Count {
  @Field()
  nom: string;
  @Field(() => Float)
  pourcentage: number;
}

@Injectable()
export class CollaborateurService {
  constructor(
    @InjectRepository(Collaborateur)
    private collaborateurRepository: Repository<Collaborateur>,
    @InjectRepository(Equipe)
    private equipeRepository: Repository<Equipe>,
    @InjectRepository(Pole)
    private poleRepository: Repository<Pole>,
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
  ) { }

  /***************Requette ElasticSearch*********/

  async search(mot: string): Promise<Collaborateur[]> {
    const cols: Collaborateur[] = [];
    const index = 'cv';
    const word = '*' + mot + '*';
    const body = {
      query: {
        query_string: {
          query: word,
        },
      },
    };
    console.log(
      `résultat des personnes recherchées pour :'${body.query.query_string.query}'`,
    );
    await client
      .search({ index: index, body: body })
      .then((results) => {
        console.log(
          `found ${results.hits.total.value} items in ${results.took}ms`,
        );
        if (results.hits.total > 0) console.log(`returned person name:`);
        results.hits.hits.forEach((hit, index) => {
          console.log(
            `\t${hit._id} - ${hit._source.nom} (score: ${hit._score})`,
          );
          cols.push(hit._source);
        });
      })
      .catch(console.error);
    if (cols !== []) {
      console.log('résultat trouvée!!');
      return cols;
    }
    console.log('pas de résultat trouvée!!');
    return [];
  }

  async searchPole(mot: string, pole: string): Promise<Collaborateur[]> {
    const cols: Collaborateur[] = [];
    const index = 'cv';
    const word = '*' + mot + '*';
    const body = {
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: pole,
              },
            },
            {
              query_string: {
                query: word,
              },
            },
          ],
        },
      },
    };

    console.log(`résultat des personnes recherchées pour :'${mot}'`);
    await client
      .search({ index: index, body: body })
      .then((results) => {
        console.log(
          `found ${results.hits.total.value} items in ${results.took}ms`,
        );
        if (results.hits.total > 0) console.log(`returned person name:`);
        results.hits.hits.forEach((hit, index) => {
          console.log(
            `\t${hit._id} - ${hit._source.nom} (score: ${hit._score})`,
          );
          cols.push(hit._source);
        });
      })
      .catch(console.error);
    if (cols !== []) {
      console.log('résultat trouvée!!');
      return cols;
    }
    console.log('pas de résultat trouvée!!');
    return [];
  }

  async searchEquipe(mot: string, equipe: string): Promise<Collaborateur[]> {
    const cols: Collaborateur[] = [];
    const index = 'cv';
    const body = {
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: equipe,
              },
            },
            {
              query_string: {
                query: mot,
              },
            },
          ],
        },
      },
    };

    console.log(`résultat des personnes recherchées pour :'${mot}'`);
    await client
      .search({ index: index, body: body })
      .then((results) => {
        console.log(
          `found ${results.hits.total.value} items in ${results.took}ms`,
        );
        if (results.hits.total > 0) console.log(`returned person name:`);
        results.hits.hits.forEach((hit, index) => {
          console.log(
            `\t${hit._id} - ${hit._source.nom} (score: ${hit._score})`,
          );
          cols.push(hit._source);
        });
      })
      .catch(console.error);
    if (cols !== []) {
      console.log('résultat trouvée!!');
      return cols;
    }
    console.log('pas de résultat trouvée!!');
    return [];
  }

  async createData(): Promise<boolean> {
    this.findAllCols().then((cols) => {
      cols.forEach((col) => {
        const str = col.id.toString();
        const collaborateur = JSON.stringify(col);
        client.index(
          {
            index: 'cv',
            id: str,
            body: collaborateur,
          },
          function (err, resp, status) {
            console.log(resp);
          },
        );
        console.log('**person:', col.nom, 'is pushed');
      });
      console.log('Successfully imported %s', cols.length, ' persons');
    })
    const { body: count } = await client.count({ index: 'cv' });
    console.log('count: ', count);
    return true;
  }

  async createIndex(): Promise<boolean> {
    client.indices.create(
      {
        index: 'cv',
      },
      function (error, response, status) {
        if (error) {
          console.log(error);
        } else {
          console.log('created a new index', response);
        }
      },
    );
    return true;
  }

  /***************Collaborateur*********/

  async findPostes(
    idPole?: number,
    idEquipe?: number,
  ): Promise<Collaborateur[]> {
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );

    query.select('poste').where('collaborateur.poste <> ""');
    if (idPole | idEquipe) {
      const rp = UserRole.RP;
      const rh = UserRole.RH;
      query
        .andWhere('collaborateur.role <> :rp', { rp })
        .andWhere('collaborateur.role <> :rh', { rh });
    }
    if (idEquipe) {
      const tl = UserRole.TEAMLEADER;
      query.andWhere('collaborateur.role <> :tl', { tl });
    }
    query.distinct(true);
    return query.getRawMany();
  }

  async findColByUsername(nomUtilisateur: string): Promise<Collaborateur> {
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    query
      .where('collaborateur.nomUtilisateur= :nomUtilisateur', {
        nomUtilisateur,
      })
      .leftJoinAndSelect('collaborateur.notifications', 'notifications')
      .leftJoinAndSelect('collaborateur.equipe', 'equipe')
      .leftJoinAndSelect('equipe.pole', 'pole')
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('equipe.teamleader', 'teamleader')
      .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .leftJoinAndSelect('collaborateur.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences');
    return query.getOne();
  }

  async findAllCols(
    poleId?: number,
    equipeId?: number,
  ): Promise<Collaborateur[]> {
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    query
      .leftJoinAndSelect('collaborateur.equipe', 'equipe')
      .leftJoinAndSelect('equipe.pole', 'pole')
      .leftJoinAndSelect('collaborateur.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
      .orderBy('collaborateur.nom');
    if (poleId) {
      query.where('pole.id = :poleId', { poleId });
    }
    if (equipeId) {
      query.where('equipe.id = :equipeId', { equipeId });
    }
    return query.getMany();
  }

  async findOneCol(id: number): Promise<Collaborateur> {
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    query
      .where('collaborateur.id= :id', { id })
      .leftJoinAndSelect('collaborateur.notifications', 'notifications')
      .leftJoinAndSelect('collaborateur.equipe', 'equipe')
      .leftJoinAndSelect('equipe.pole', 'pole')
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('equipe.teamleader', 'teamleader')
      .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .leftJoinAndSelect('collaborateur.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences');
    return query.getOne();
  }

  async createCol(createColInput: CreateColInput) {
    const equipeId = createColInput.equipeId;
    const query = this.equipeRepository.createQueryBuilder('equipe');
    query.where('equipe.id= :equipeId', { equipeId });
    const newCol = this.collaborateurRepository.create(createColInput);
    const equipe = await query.getOne()
    // .then((equipe) => {
    newCol.equipe = equipe;
    console.log('col', newCol);
    // });
    // setTimeout(() => {
    // console.log('col2', newCol);
    // }, 500);
    return this.collaborateurRepository.save(newCol);
  }

  // async createColab(createColInput: CreateColInput): Promise<Collaborateur> {
  //   let newCol : Collaborateur;
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   this.createCol(createColInput).then((response: Collaborateur, err: any) => {
  //     newCol = response;
  //   });
  // }

  async updateCol(
    id: number,
    updateColInput: UpdateColInput,
  ): Promise<Collaborateur> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newCol = await this.collaborateurRepository.preload({
      id,
      ...updateColInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newCol) {
      //si l id n existe pas
      throw new NotFoundException(`col d'id ${id} n'exsite pas!`);
    }
    return await this.collaborateurRepository.save(newCol);
  }

  async updateRole(id: number, role: UserRole): Promise<Collaborateur> {
    return new Promise(async (resolve, reject) => {
      const updateColInput = new UpdateColInput();
      updateColInput.role = role;
      const newCol = await this.collaborateurRepository.preload({
        id,
        ...updateColInput,
      });
      if (!newCol) {
        throw new NotFoundException(`col d'id ${id} n'exsite pas!`);
      }
      console.log("nouveau Col:", newCol.nom, newCol.role);
      resolve(this.collaborateurRepository.save(newCol));
      return;
    });
  }

  async updateRoleEquipe(id: number, role: UserRole, equipe: Equipe): Promise<Collaborateur> {
    return new Promise(async (resolve, reject) => {
      const updateColInput = new UpdateColInput();
      updateColInput.role = role;
      const newCol = await this.collaborateurRepository.preload({
        id,
        ...updateColInput,
      });
      if (!newCol) {
        throw new NotFoundException(`col d'id ${id} n'exsite pas!`);
      }
      newCol.equipe = equipe;
      console.log("nv Col:", newCol.nom, newCol.role, newCol.equipe);
      resolve(this.collaborateurRepository.save(newCol));
      return;
    });
  }

  async updateRpPole(poleId: number, rpId: number): Promise<Pole> {
    const pole = await this.findOnePole(poleId);
    return await this.findOneCol(rpId).then(async (newRp) => {
      return await this.updateRoleEquipe(pole.rp.id, UserRole.COLLABORATEUR, newRp.equipe).then(async (rp) => {
        console.log("**old Rp:", rp)
        console.log("**old newRp:", newRp)
        return await this.updateRoleEquipe(newRp.id, UserRole.RP, null).then((newDataRp) => {
          pole.rp = newDataRp;
          console.log("**newRp:", newDataRp);
          return this.poleRepository.save(pole);
        })
      })
    })
  }

  async updateColEquipe(colId: number, equipeId: number): Promise<Collaborateur> {
    const equipe = await this.findOneEquipe(equipeId);
    return await this.updateRoleEquipe(colId, UserRole.COLLABORATEUR, equipe).then(async (newCol) => {
      return await this.collaborateurRepository.save(newCol);
    })
  }

  // async updateTlEquipe(equipeId: number, tlId: number): Promise<Equipe> {
  //   const equipe = await this.findOneEquipe(equipeId);
  //   return await this.findOneCol(equipe.teamleader.id).then(async (oldTl) => {
  //     return await this.findOneCol(tlId).then(async (newTl) => {
  //       return await this.updateRole(oldTl.id, UserRole.COLLABORATEUR).then(async (tl) => {
  //         console.log("ancien TL:", tl);
  //         return await this.updateRole(newTl.id, UserRole.TEAMLEADER).then(async (newDataTl) => {
  //           equipe.teamleader = newDataTl;
  //           // equipe.collaborateurs.forEach(col => {

  //           // });
  //           console.log("newTL:", newDataTl);
  //           console.log("equipe:", equipe);
  //           return await this.equipeRepository.save(equipe);
  //         })
  //       })
  //     })
  //   })
  // }

  async updateTlEquipe(equipeId: number, tlId: number): Promise<Equipe> {
    const equipe = await this.findOneEquipe(equipeId);
    const oldTlId = equipe.teamleader.id;
    return await this.findOneCol(tlId).then(async (newTl) => {
      return await this.updateRoleEquipe(newTl.id, UserRole.TEAMLEADER, equipe).then(async (newDataTl) => {
        console.log("newTL:", newDataTl);
        equipe.teamleader = newDataTl;
        console.log("old equipe:", equipe);
        await this.equipeRepository.save(equipe);
        return await this.findOneCol(oldTlId).then(async (oldTl) => {
          return await this.updateRole(oldTl.id, UserRole.COLLABORATEUR).then(async (tl) => {
            console.log("ancien TL:", tl);
            return await this.updateRoleEquipe(newTl.id, UserRole.TEAMLEADER, equipe).then(async () => {
              console.log("new equipe:", equipe);
              return equipe;
            })
          })
        })
      })
    })
  }

  async removeCol(idCol: number): Promise<boolean> {
    let supp = false;
    const col = await this.findOneCol(idCol);
    console.log('delete col:', col);
    const coltoremove = this.collaborateurRepository.remove(col);
    const cv = await this.cvRepository.findOne({
      where: { id: col.cv.id },
    });
    await this.cvRepository.remove(cv);
    console.log('deleted col:', col);
    console.log('delete cv:', cv);
    if (coltoremove) supp = true;
    return await supp;
  }

  async getFilterCols(
    selectedPoles?: number[],
    selectedEquipes?: number[],
    selectedPoste?: string[],
    selectedComp?: string[],
  ): Promise<Collaborateur[]> {
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    console.log('*************');
    if (selectedPoles) {
      console.log('pole true');
      query.andWhere('pole.id in (:selectedPoles)', { selectedPoles });
    }
    if (selectedPoste) {
      console.log('poste true');
      query.andWhere('collaborateur.poste in (:selectedPoste)', {
        selectedPoste,
      });
    }
    if (selectedEquipes) {
      console.log('equipe true');
      query.andWhere('equipe.id in (:selectedEquipes)', { selectedEquipes });
    }
    if (selectedComp) {
      console.log('comp true');
      query.andWhere('competences.nom in (:selectedComp)', { selectedComp });
    }
    query
      .leftJoinAndSelect('collaborateur.equipe', 'equipe')
      .leftJoinAndSelect('equipe.pole', 'pole')
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('equipe.teamleader', 'teamleader')
      .leftJoinAndSelect('collaborateur.notifications', 'notifications')
      .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .leftJoinAndSelect('collaborateur.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
      .orderBy('collaborateur.nom');
    return query.getMany();
  }

  async getFilteredCols(filter: FilterInput): Promise<Collaborateur[]> {
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    console.log('filter:', filter);
    const valeurs = filter.valeurs;
    const champs = filter.champs;
    query
      .where(':champs in (:...valeurs)', { champs, valeurs })
      .leftJoinAndSelect('collaborateur.equipe', 'equipe')
      .leftJoinAndSelect('equipe.pole', 'pole')
      .printSql();
    console.log('query**********', query);
    return query.getMany();
  }

  async getFilterUsers(selectedRoles: UserRole[]): Promise<Collaborateur[]> {
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    if (selectedRoles) {
      query.where('collaborateur.role in (:selectedRoles)', { selectedRoles });
    }
    query
      .leftJoinAndSelect('collaborateur.equipe', 'equipe')
      .leftJoinAndSelect('equipe.pole', 'pole')
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('equipe.teamleader', 'teamleader')
      .leftJoinAndSelect('collaborateur.notifications', 'notifications')
      .leftJoinAndSelect('collaborateur.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('collaborateur.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .orderBy('collaborateur.nom');
    return query.getMany();
  }
  async findPoleRp(idRP: number): Promise<Pole> {
    const query = this.poleRepository.createQueryBuilder('pole');
    query
      .where('rp.id= :idRP', { idRP })
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('rp.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('pole.equipes', 'equipes')
      .leftJoinAndSelect('equipes.collaborateurs', 'collaborateurs');
    return query.getOne();
  }

  async findMailCol(email: string) {
    const query = this.collaborateurRepository.createQueryBuilder('collaborateur');
    query
      .where('collaborateur.emailPro= :email', { email })
      .orWhere('collaborateur.email= :email', { email })
      .leftJoinAndSelect('collaborateur.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences');
    return query.getOne();
  }

  /***************Pole*********/
  async findAllPoles(): Promise<Pole[]> {
    //return this.poleRepository.find({relations: ['equipes']});
    const query = this.poleRepository.createQueryBuilder('pole');
    query
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('rp.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('pole.equipes', 'equipes')
      .leftJoinAndSelect('equipes.collaborateurs', 'collaborateurs')
      .leftJoinAndSelect('equipes.teamleader', 'teamleader')
      .leftJoinAndSelect('collaborateurs.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .orderBy('pole.nom');
    return query.getMany();
  }

  async findOnePole(id: number): Promise<Pole> {
    //return this.poleRepository.findOneOrFail(idPole,{relations: ['collaborateurs']});
    const query = this.poleRepository.createQueryBuilder('pole');
    query
      .where('pole.id= :id', { id })
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('rp.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('pole.equipes', 'equipes')
      .leftJoinAndSelect('equipes.collaborateurs', 'collaborateurs')
      .leftJoinAndSelect('equipes.teamleader', 'teamleader')
      .leftJoinAndSelect('collaborateurs.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
    return query.getOne();
  }

  async createPole(createPoleInput: CreatePoleInput): Promise<Pole> {
    const newPole = this.poleRepository.create(createPoleInput);
    return this.poleRepository.save(newPole);
  }

  /***************Equipe*********/
  async findAllEquipes(): Promise<Equipe[]> {
    //return this.equipeRepository.find({relations: ['collaborateurs']});
    const query = this.equipeRepository.createQueryBuilder('equipe');
    query
      .leftJoinAndSelect('equipe.pole', 'pole')
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('equipe.collaborateurs', 'collaborateurs')
      .leftJoinAndSelect('equipe.teamleader', 'teamleader')
      .leftJoinAndSelect('collaborateurs.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .leftJoinAndSelect('teamleader.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences')
      .orderBy('equipe.nom');
    return query.getMany();
  }

  async findOneEquipe(id: number): Promise<Equipe> {
    const query = this.equipeRepository.createQueryBuilder('equipe');
    query
      .where('equipe.id= :id', { id })
      .leftJoinAndSelect('equipe.pole', 'pole')
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('equipe.collaborateurs', 'collaborateurs')
      .leftJoinAndSelect('equipe.teamleader', 'teamleader')
      .leftJoinAndSelect('collaborateurs.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens')
      .leftJoinAndSelect('teamleader.cv', 'cv')
      .leftJoinAndSelect('cv.competences', 'competences');
    return query.getOne();
  }

  async findEquipesPoles(idPoles?: number[]): Promise<Equipe[]> {
    //return this.equipeRepository.find({relations: ['collaborateurs']});
    const query = this.equipeRepository.createQueryBuilder('equipe');
    if (idPoles) {
      query.where('pole.id in (:idPoles) ', { idPoles })
    }
    query.leftJoinAndSelect('equipe.pole', 'pole')
      .leftJoinAndSelect('pole.rp', 'rp')
      .leftJoinAndSelect('equipe.collaborateurs', 'collaborateurs')
      .leftJoinAndSelect('equipe.teamleader', 'teamleader');
    return query.getMany();
  }

  async findRoles(): Promise<Collaborateur[]> {
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    query.select('role').distinct(true);
    return query.getRawMany();
  }

  /***************Statistique*********/
  async colEquipe(equipeId: number): Promise<number> {
    let count: number;
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    query
      .leftJoinAndSelect('collaborateur.equipe', 'equipe')
      .leftJoinAndSelect('equipe.pole', 'pole')
      .where('equipe.id= :equipeId', { equipeId });
    return count = (await query.getMany()).length;
  }

  async colPole(poleId: number): Promise<number> {
    let count: number;
    const query = this.collaborateurRepository.createQueryBuilder(
      'collaborateur',
    );
    query
      .leftJoinAndSelect('collaborateur.equipe', 'equipe')
      .leftJoinAndSelect('equipe.pole', 'pole')
      .where('pole.id= :poleId', { poleId });
    return count = ((await query.getMany()).length) + 1;
  }

  async countColsEquipes(): Promise<Count[]> {
    const listEquipes: Count[] = [];
    let sum = 0;
    const equipes = await this.findAllEquipes();
    // console.log("equipes:", equipes);
    for (const equipe of equipes) {
      const count = new Count();
      count.nom = equipe.nom;
      // console.log("equipe:", equipe.id);
      count.pourcentage = await this.colEquipe(equipe.id);
      sum += count.pourcentage;
      // console.log("count:", count);
      await listEquipes.push(count);
      console.log("liste:", listEquipes);
    };
    // console.log("sum:", sum);
    listEquipes.forEach(element => {
      element.pourcentage = element.pourcentage * 100 / sum
    });
    return listEquipes;
  }

  async countColsPoles(): Promise<Count[]> {
    const listPoles: Count[] = [];
    let sum = 0;
    const poles = await this.findAllPoles();
    // console.log("poles:", poles);
    for (const pole of poles) {
      const count = new Count();
      count.nom = pole.nom;
      // console.log("pole:", pole.id);
      count.pourcentage = await this.colPole(pole.id);
      sum += count.pourcentage;
      // console.log("count:", count);
      await listPoles.push(count);
      // console.log("liste:", listPoles);
    };
    // console.log("sum:", sum);
    listPoles.forEach(element => {
      element.pourcentage = element.pourcentage * 100 / sum
    });
    return listPoles;
  }

}
