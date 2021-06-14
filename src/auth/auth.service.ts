/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CollaborateurService } from 'src/collaborateur/collaborateur.service';
import { Collaborateur } from './../collaborateur/entities/collaborateur.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import * as ldap from 'ldapjs';
import { Roles } from 'src/decorators/role.decorator';

// user and pass are for existing user with rights to add a user

@ObjectType()
export class Connexion {
  @Field()
  public access_token: string;
  @Field((type) => Collaborateur)
  public user: Collaborateur;
}

@Injectable()
export class AuthService {
  constructor(
    private collaborateurService: CollaborateurService,
    private jwtService: JwtService
  ) {}

  async login({ nomUtilisateur, motDePasse }):Promise<Connexion>
  {
    const status = await this._bindLDAP({ nomUtilisateur, motDePasse })
    if(status){
      return this.getToken(nomUtilisateur);
    }
    // else return null;
    // return status;
}

private async _bindLDAP({ nomUtilisateur, motDePasse }) {
    return new Promise((resolve, reject) => {
        var client = ldap.createClient({
            url: 'ldap://127.0.0.1:1389'
          });

        const adminusername = 'cn=admin,dc=example,dc=org';
        const adminpassword = 'adminpassword';

        client.bind(adminusername, adminpassword, (err) => {
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
    
            const opts: ldap.SearchOptions = {
                filter: `(cn=${nomUtilisateur})`,
                scope: 'sub',
                attributes: ['dn', 'sn', 'cn']
            };
         
            client.search('ou=Users,dc=example,dc=org', opts, (err, res) => {    
              res.on('searchRequest', (searchRequest) => {
                console.log('searchRequest: ', searchRequest.messageID);
              });
    
              res.on('searchEntry', (entry) => {
                console.log('entry: ' + JSON.stringify(entry.object));
                // const motDePasseHash = ssha.create(motDePasse);
                // console.log("mot de passe hash:",motDePasseHash);
                client.bind(entry.object.dn, motDePasse ,function(err){
                    if (err) {
                      console.log({ err });
                      resolve(false);
                      return;
                    }
                    resolve(true);
                    return;
                });
    
              });
    
              res.on('searchReference', (referral) => {
                console.log('referral: ' + referral.uris.join());
              });
    
              res.on('error', (err) => {
                console.error('error: ' + err.message);
                resolve(false);
                return;
              });
    
              res.on('end', (result) => {
                console.log('status: ' + result.status);
              });
            });
        });
    })
  }

  async addUser({nomUtilisateur, motDePasse}):Promise<boolean>{
    var client = ldap.createClient({
      url: 'ldap://127.0.0.1:1389'
    });
    const adminusername = 'cn=admin,dc=example,dc=org';
    const adminpassword = 'adminpassword';
  
    var newDN = `cn=${nomUtilisateur},ou=Users,dc=example,dc=org`;
    var newUser = {
      cn: nomUtilisateur,
      sn: nomUtilisateur,
      uid: nomUtilisateur,
      // mail: 'nguy@example.org',
      objectClass: 'inetOrgPerson',
      userPassword: motDePasse
    }
  
    client.bind(adminusername,adminpassword,(err)=>{
      client.add(newDN, newUser,  (err) => {
        // console.log('*'.repeat(50), {err});
        return false;
      });
      if(err){return false;}
    });
    return true;
  }

  async getToken(nomUtilisateur): Promise<Connexion> {
    try {
      const person = await this.collaborateurService.findColByUsername(
        nomUtilisateur,
      );
      const token = await this.jwtService.signAsync({nomUtilisateur,id:person.id});
      console.log('username:', nomUtilisateur, 'token:', token);
      return {
        access_token: token,
        user: person,
      };
    } catch (err) {
      console.error(err);
    }
  }
}
// user and pass are for existing user with rights to add a user


  // async validate(
  //   nomUtilisateur: string,
  //   motDePasse: string,
  // ): Promise<Collaborateur | null> {
  //   const user = await this.collaborateurService.findColByUsername(
  //     nomUtilisateur,
  //   );

  //   if (!user) {
  //     return null;
  //   }

  //   const passwordIsValid = motDePasse === user.motDePasse;
  //   return passwordIsValid ? user : null;
  // }

  // verify(token: string): Promise<Collaborateur> {
  //   const decoded = this.jwtService.verify(token, {
  //     secret: jwtConstants.secret,
  //   });

  //   const user = this.collaborateurService.findColByUsername(
  //     decoded.nomUtilisateur,
  //   );

  //   if (!user) {
  //     throw new Error('Unable to get the user from decoded token.');
  //   }

  //   return user;
  // }

  // async login({
  //   nomUtilisateur,
  //   motDePasse,
  // }): Promise<Connexion | GraphQLError> {
  //   try {
  //     const person = await this.collaborateurRepository
  //       .createQueryBuilder('collaborateur')
  //       .addSelect('collaborateur.motDePasse')
  //       .where('collaborateur.nomUtilisateur = :nomUtilisateur', {
  //         nomUtilisateur,
  //       })
  //       .getOne();
  //     console.log('person:', person);
  //     if (!person) {
  //       console.log('nom utilisateur erroné');
  //       return new GraphQLError('nom utilisateur erroné');
  //     }
  //     person.motDePasse = await bcrypt.hash(person.motDePasse, 10);
  //     const isSame = await bcrypt.compare(motDePasse, person.motDePasse);
  //     console.log('issame:', isSame);
  //     return person && isSame
  //       ? this.getToken(nomUtilisateur, person.id).then((result) => result)
  //       : new GraphQLError('nom utilisateur ou mot de passe erroné');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  

