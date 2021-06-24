/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CollaborateurService } from './../collaborateur/collaborateur.service';
import { Collaborateur } from './../collaborateur/entities/collaborateur.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import * as ldap from 'ldapjs';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { TokenExpiredError } from 'jsonwebtoken';
import { LoginUserPayload } from './Dto/login-user.payload';

// user and pass are for existing user with rights to add a user



@Injectable()
export class AuthService {
  constructor(
    private collaborateurService: CollaborateurService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  // async login({ nomUtilisateur, motDePasse }):Promise<Connexion>
  // {
  //   const status = await this._bindLDAP({ nomUtilisateur, motDePasse })
  //   if(status){
  //     return this.getToken(nomUtilisateur);
  //   }
  //   else return {access_token:''};
  //   // return status;
  // }

  async login({ nomUtilisateur, motDePasse }):Promise<LoginUserPayload>
  {
    let user : Collaborateur;
    const status = await this._bindLDAP({ nomUtilisateur, motDePasse })
    if(status){
      user = await this.collaborateurService.findColByUsername(
        nomUtilisateur,
      );
      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(
        user,
        60 * 60 * 24 * 30,
      );
      const payload = new LoginUserPayload();
      payload.user = user;
      payload.access_token = accessToken;
      payload.refresh_token = refreshToken;
      return payload;
    }
    else {
      console.log("nom utilisateur ou mot de passe incorrect!!")
      return {access_token:'',refresh_token:''};
    }
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
                reject(false);
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
                      reject(false);
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
                reject(false);
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

  // async getToken(nomUtilisateur): Promise<Connexion> {
  //   try {
  //     const person = await this.collaborateurService.findColByUsername(
  //       nomUtilisateur,
  //     );
  //     const token = await this.jwtService.signAsync({nomUtilisateur,id:person.id},{expiresIn: 1800});
  //     return {
  //       access_token: token,
  //       user: person,
  //     };
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  async generateAccessToken(user: Collaborateur) {
    const payload = { id: user.id };
    return await this.jwtService.signAsync(payload,{expiresIn: 120});
  }

  async createRefreshToken(user: Collaborateur, ttl: number) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);

    const token = this.refreshTokenRepository.create({
      user,
      expires: expiration,
    });

    return await this.refreshTokenRepository.save(token);
  }

  async generateRefreshToken(user: Collaborateur, expiresIn: number) {
    const payload = { sub: String(user.id) };
    const token = await this.createRefreshToken(user, expiresIn);
    return await this.jwtService.signAsync({
      ...payload,
      expiresIn,
      jwtId: String(token.id),
    });
  }

  async resolveRefreshToken(encoded: string) {
    try {
      const payload = await this.jwtService.verify(encoded);
      console.log("payload:",payload)
      if (!payload.sub || !payload.jwtId) {
        throw new UnprocessableEntityException("Refresh token malformed");
      }

      const token = await this.refreshTokenRepository.findOne({
        id: payload.jwtId,
      });

      if (!token) {
        throw new UnprocessableEntityException("Refresh token not found");
      }

      if (token.revoked) {
        throw new UnprocessableEntityException("Refresh token revoked");
      }
      console.log("**subject:",payload.sub);
      const user = await this.collaborateurService.findOneCol(payload.sub);
      if (!user) {
        throw new UnprocessableEntityException("Refresh token malformed");
      }
      console.log("**user:",user);
      return { user, token };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException("Refresh token expired");
      } else {
        throw new UnprocessableEntityException("Refresh token malformed");
      }
    }
  }

  async createAccessTokenFromRefreshToken(refresh: string) {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }


}

  

