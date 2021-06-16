/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CollaborateurService } from 'src/collaborateur/collaborateur.service';
import { Collaborateur } from './../collaborateur/entities/collaborateur.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import * as ldap from 'ldapjs';

// user and pass are for existing user with rights to add a user

@ObjectType()
export class Connexion {
  @Field()
  public access_token: string;
  @Field((type) => Collaborateur, {nullable: true})
  public user?: Collaborateur;
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
    else return {access_token:''};
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
      const token = await this.jwtService.signAsync({nomUtilisateur,id:person.id},{expiresIn: 1800});
      return {
        access_token: token,
        user: person,
      };
    } catch (err) {
      console.error(err);
    }
  }

}

  

