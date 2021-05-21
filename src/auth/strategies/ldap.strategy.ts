import * as Strategy from 'passport-ldapauth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Collaborateur } from './../../collaborateur/entities/collaborateur.entity';
import SimpleLDAP from 'simple-ldap-search';
import { UserRole } from './../../enum/UserRole';

// const { authenticate } = require('ldap-authentication')

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
	// date1 = new Date('1996-10-13 00:00:00')
    // date2 = new Date('2017-01-25 00:00:00')
	// private readonly users: Collaborateur[]= [
    //     {id:2,nom:"timelli",prenom:"oumayma",cin:1245678,dateNaiss:this.date1,adresse:"Bizerte",tel:20100300,email:"oumayma.timelli@gmail.com",avatar:"oumayma.jpg",cvId:2,telPro:21200500,emailPro:"oumayma.timelli@proxym-it.com",poste:"ingenieur web full stack",salaire:1400,dateEmb:this.date2,nomUtilisateur:"oumaymaTime",motDePasse:"1234",evaluation:3,role:UserRole.COLLABORATEUR}, 
    //     {id:3,nom:"miled",prenom:"nour elhouda",cin:18461635,dateNaiss:this.date1,adresse:"sousse",tel:25100200,email:"nourelhouda.miled@gmail.com",avatar:"nour.jpg",cvId:3,telPro:25600700,emailPro:"nourelhouda.miled@proxym-it.com",poste:"Ressources humaines ",salaire:2200,dateEmb:this.date2,nomUtilisateur:"nourMiled",motDePasse:"1234",evaluation:4,role:UserRole.RH},
    //     {id:4,nom:"hassine",prenom:"bilel",cin:1246541,dateNaiss:this.date1,adresse:"Banane, Monastir",tel:26500600,email:"bilel.hassine@gmail.com",avatar:"bilel.jpg",cvId:4,telPro:28500600,emailPro:"bilel.hassine@proxym-it.com",poste:"responsable pole ESS",salaire:3500,dateEmb:this.date2,nomUtilisateur:"bilelHassine",motDePasse:"1234",evaluation:4,role:UserRole.RP},
    //     {id:5,nom:"jammali",prenom:"nidhal",cin:9451327,dateNaiss:this.date1,adresse:"Sousse",tel:20300100,email:"nidhal.jammali@gmail.com",avatar:"tof.jpg",cvId:5,telPro:20300100,emailPro:"nidhal.jammali@gmail.com",poste:"chef d'equipe PNL",salaire:2500,dateEmb:this.date2,nomUtilisateur:"nidhalJam",motDePasse:"1234",evaluation:4,role:UserRole.TEAMLEADER},
    //     {id:6,nom:"boubou",prenom:"ali",cin:1234654,dateNaiss:this.date1,adresse:"sousse",tel:29900800,email:"ali.boubou@gmail.com",avatar:"man.png",cvId:6,telPro:25900800,emailPro:"ali.boubou@proxym-it.com",poste:"chef d'equipe BEST",salaire:2500,dateEmb:this.date2,nomUtilisateur:"aliBou",motDePasse:"1234",evaluation:4,role:UserRole.TEAMLEADER},
    //     {id:8,nom:"cherif",prenom:"ahmed",cin:8529637,dateNaiss:this.date1,adresse:"sousse",tel:21100100,email:"ahmed.cherif@gmail.com",avatar:"man.png",cvId:8,telPro:25100100,emailPro:"ahmed.cherif@proxym-it.com",poste:"responsable pole Mobile",salaire:3500,dateEmb:this.date2,nomUtilisateur:"ahmedCh",motDePasse:"1234",evaluation:5,role:UserRole.RP},
    //     {id:10,nom:"rassas",prenom:"med amine",cin:12348745,dateNaiss:this.date1,adresse:"centre ville sousse",tel:98453785,email:"med.amine.rassas@gmail.com",avatar:"rassas.jpg",cvId:10,telPro:26100580,emailPro:"med.amine.rassas@proxym-it.com",poste:"developpeur web",salaire:700,dateEmb:this.date2,nomUtilisateur:"amineRass",motDePasse:"1234",evaluation:3,role:UserRole.COLLABORATEUR},
    //     {id:11,nom:"mhiri",prenom:"sadok mourad",cin:12348728,dateNaiss:this.date1,adresse:"hamem sousse",tel:98453285,email:"sadok.mhiri@gmail.com",avatar:"sadok.jpg",cvId:11,telPro:26100680,emailPro:"sadok.mhiri@proxym-it.com",poste:"developpeur mobile",salaire:700,dateEmb:this.date2,nomUtilisateur:"sadokMh",motDePasse:"1234",evaluation:3,role:UserRole.COLLABORATEUR},
    //     {id:12,nom:"abid",prenom:"montassar",cin:94513455,dateNaiss:this.date1,adresse:"sousse",tel:20350150,email:"montassar.abid@gmail.com",avatar:"man.png",cvId:12,telPro:25300150,emailPro:"montassar.abid@proxym-it.com",poste:"chef d'equipe Java",salaire:2500,dateEmb:this.date2,nomUtilisateur:"Monta",motDePasse:"1234",evaluation:4,role:UserRole.TEAMLEADER},
    //     {id:13,nom:"admin",prenom:"super",cin:1111111,dateNaiss:this.date1,adresse:"sousse",tel:20352550,email:"admin@gmail.com",avatar:"admin.png",cvId:13,telPro:25311150,emailPro:"admin@proxym-it.com",poste:"Administrateur",salaire:1000,dateEmb:this.date2,nomUtilisateur:"admin",motDePasse:"1234",evaluation:5,role:UserRole.ADMIN}]
	
	constructor(
	) {
		super({
			passReqToCallback: true,
			server: {
				url: 'ldap://ldap.forumsys.com:389',
				bindDN: 'root',
				bindCredentials: 'password',
				searchBase: 'o=users,o=proxym',
				searchFilter: '(uid={{NomUtilisateur}})',
				searchAttributes: ['telPro', 'emailPro','poste'],
			},
		}, async (req: Request, user: Collaborateur, done) => {
			req.user = user;
			return done(null, user);
		});
	}

	async validate(payload: any) {
		const { id, nomUtilisateur } = payload;
		return { id, nomUtilisateur };
	  }

// 	constructor(){
// 		super(
// 			auth()
// 		);
// 	}

// async function auth() {
//   // auth with admin
//   let options = {
//     ldapOpts: {
//       url: 'ldap://ldap.forumsys.com',
//       // tlsOptions: { rejectUnauthorized: false }
//     },
//     adminDn: 'cn=read-only-admin,dc=example,dc=com',
//     adminPassword: 'password',
//     userPassword: 'password',
//     userSearchBase: 'dc=example,dc=com',
//     usernameAttribute: 'uid',
//     username: 'mayssa',
//     // starttls: false
//   }

//   let user = await authenticate(options)
//   console.log(user)

//   // auth with regular user
//   options = {
//     ldapOpts: {
//       url: 'ldap://ldap.forumsys.com',
//       // tlsOptions: { rejectUnauthorized: false }
//     },
//     userDn: 'uid=einstein,dc=example,dc=com',
//     userPassword: 'password',
//     userSearchBase: 'dc=example,dc=com',
//     usernameAttribute: 'uid',
//     username: 'einstein',
//     // starttls: false
//   }

//   user = await authenticate(options)
//   console.log(user)
// }



}

// const config = {
// 	url: 'ldap://0.0.0.0:4000',
// 	base: 'dc=users,dc=localhost',
// 	dn: 'cn=root',
// 	password: 'secret',
//   };
//    // create a new client
//    const ldap = new SimpleLDAP(config);
	  
//    // setup a filter and attributes for your LDAP query
//    const filter = '(uid=artvandelay)';
//    const attributes = ['idNumber', 'uid', 'givenName', 'sn', 'telephoneNumber'];
   
//    // using async/await
//    const users = ldap.search(filter, attributes);