/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { readdir } from 'fs';
import { PersonneService } from './../candidat/personne.service';
import { CreatePersonneInput } from './../candidat/dto/create-personne.input';
import { Competence } from './entities/competence.entity';
import { UpdateCompetenceInput } from './dto/update-competence.input';
import { CreateCompetenceInput } from './dto/create-competence.input';
import { Personne } from './../candidat/entities/personne.entity';
import { Collaborateur } from './../collaborateur/entities/collaborateur.entity';
import { CollaborateurService } from './../collaborateur/collaborateur.service';
import { UpdatePersonneInput } from './../candidat/dto/update-personne.input';
import { CreateCandidatureInput } from './../candidat/dto/create-candidature.input';
import { StatutCV } from './../enum/StatutCV';
// import * as ResumeParser from 'resume-parser';
// var imaps = require('imap-simple');
// const _ = require('lodash');
var inspect = require('util').inspect;
var fs = require('fs');
const { Base64Decode } = require('base64-stream');
var Imap = require('node-imap');
const ResumeParser = require('./../../src');

var imap = new Imap({
  user: 'analysecvtest@gmail.com',
  password: 'secret-123',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  authTimeout: 20000,
  connTimeout: 20000,
});

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    private personneService: PersonneService,
    private colService: CollaborateurService,
    @InjectRepository(Competence)
    private competenceRepository: Repository<Competence>,
  ) {}

  /***************Cv*********/

  // async uploadFile(parent, { file }) {
  //   const { createReadStream, filename, mimetype, encoding } =  await file;
  //   const stream = createReadStream();
  //   await new Promise((resolve, reject) => {
  //         stream.on('error', error => {
  //             unlink(path, () => {
  //               reject(error);
  //             });
  //         }).pipe(createWriteStream(filename))
  //           .on('error', reject)
  //           .on('finish', resolve)
  //     });
  //   console.log('-----------file written');
  //  return file;
  // }

  async getCandidature() {
    var datePost;
    var emailCand;
    this.getMsg().then(({ date, email }) => {
      datePost = date;
      emailCand = email;
    });
    console.log('__datePost:', datePost);
    console.log('__EmailPost:', emailCand);
    return datePost;
  }

  async getMsg() {
    return new Promise((resolve, reject) => {
      var email;
      var date;
      imap.once('ready', function () {
        imap.openBox('INBOX', true, function (err, box) {
          if (err) throw err;
          imap.search(
            ['ALL', ['SINCE', 'APRIL 10, 2021']],
            function (err, results) {
              if (err) throw err;
              var f = imap.seq.fetch(box.messages.total + ':*', {
                bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                struct: true,
              });
              f.on('message', function (msg, seqno) {
                console.log('Message #%d', seqno);
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function (stream, info) {
                  if (info.which === 'TEXT')
                    console.log(
                      prefix + 'Body [%s] found, %d total bytes',
                      inspect(info.which),
                      info.size,
                    );
                  var buffer = '',
                    count = 0;
                  stream.on('data', function (chunk) {
                    count += chunk.length;
                    buffer += chunk.toString('utf8');
                    console.log('BUFFER', buffer); //HEre i am able to view the body
                    if (info.which === 'TEXT')
                      console.log(
                        prefix + 'Body [%s] (%d/%d)',
                        inspect(info.which),
                        count,
                        info.size,
                      );
                  });
                  stream.once('end', function () {
                    if (info.which !== '') {
                      console.log(
                        prefix + 'Parsed header: %s',
                        inspect(Imap.parseHeader(buffer)),
                      );
                      var user = Imap.parseHeader(buffer).from;
                      var parts = user.toString().split('<');
                      var part = parts[1];
                      var parties = part.split('>');
                      email = parties[0];
                      console.log('----email:', email);
                    } else console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                  });
                });
                msg.once('attributes', function (attrs) {
                  console.log(
                    prefix + 'Attributes: %s',
                    inspect(attrs, false, 8),
                  );
                  date = attrs.date;
                  console.log('***date postul:', date);
                  // addCandidature(date,email);
                });
                msg.once('end', function () {
                  console.log(prefix + 'Finished');
                });
              });
              f.once('error', function (err) {
                console.log('Fetch error: ' + err);
                reject(new Error(err));
              });
              f.once('end', function () {
                console.log('Done fetching all messages!');
                imap.end();
              });
            },
          );
          resolve({ date, email });
        });
      });
      imap.once('error', function (err) {
        console.log(err);
        reject(new Error(err));
      });
      imap.connect();
    });
  }

  async extractOneCv(file): Promise<boolean> {
    const inputDir = 'files/cvs/';
    const outputDir = 'files/compiledFiles';
    ResumeParser.parseResumeFile(inputDir + file, outputDir) // input file, output dir
      .then((file) => {
        console.log('Yay! ' + file);
      })
      .catch((error) => {
        console.error(error);
      });
    return true;
  }

  async addCvs(): Promise<boolean> {
    const directory_name = 'files/compiledFiles/';
    await readdir(directory_name, async (err, files) => {
      if (err) throw err;
      // console.log('******Répertoire: ', directory_name, '*****files:', files);
      for (const file of files) {
        const rawdata = fs.readFileSync(directory_name + file);
        const output = JSON.parse(rawdata);
        let cand: Personne;
        let col: Collaborateur;
        await this.personneService
          .findPerByMail(output.email)
          .then((result) => {
            cand = result;
          });
        await this.colService.findMailCol(output.email).then((result) => {
          col = result;
        });
        if (!cand && !col) {
          // console.log("Personne",output.name,"n'existe pas",cv)
          var createcvinput = new CreateCvInput();
          createcvinput.statutCV = StatutCV.RECU;
          createcvinput.cmptLinkedin = output.profiles;
          createcvinput.activiteAssociatives = output.ActAssociatives;
          createcvinput.experiences = output.experience;
          createcvinput.formations = output.education;
          createcvinput.certificats = output.certification;
          createcvinput.interets = output.interests;
          createcvinput.projets = output.projects;
          createcvinput.competences = this.addCompetences(output);
          output.languages = this.addLangues(output);
          createcvinput.langues = output.languages;
          this.createCV(createcvinput).then((cv) => {
            var createperinput = new CreatePersonneInput();
            createperinput.nom = output.name;
            createperinput.email = output.email;
            createperinput.tel = output.phone;
            if (output.datebirdh) {
              var parts = output.datebirdh.split('/');
              var date = new Date(parts[2], parts[1] - 1, parts[0]);
              createperinput.dateNaiss = date;
            } else {
              var date = new Date('1899-11-29T23:46:24.000Z');
              createperinput.dateNaiss = date;
            }
            createperinput.etatCivil = output.etatcivil;
            createperinput.adresse = output.address;
            createperinput.cvId = cv.id;
            this.personneService.createPersonne(createperinput);
            console.log('perinput:', createperinput);
          });
          console.log('cvinput:', createcvinput);
        } else if (col) {
          console.log(
            'Personne',
            output.name,
            ' existe déja en tant que collaborateur!',
          );
        } else {
          this.updateCand(output, cand);
        }
      }
    });
    return true;
  }

  updateCand(output, cand) {
    console.log('Personne', output.name, ' existe déja !');
    console.log('updating CV...');
    var updatecvinput = new UpdateCvInput();
    updatecvinput.cmptLinkedin = output.profiles;
    updatecvinput.activiteAssociatives = output.ActAssociatives;
    updatecvinput.experiences = output.experience;
    updatecvinput.formations = output.education;
    updatecvinput.certificats = output.certification;
    updatecvinput.interets = output.interests;
    updatecvinput.projets = output.projects;
    updatecvinput.competences = this.addCompetences(output);
    output.languages = this.addLangues(output);
    updatecvinput.langues = output.languages;
    this.updateCV(cand.cv.id, updatecvinput);
    var updateperinput = new UpdatePersonneInput();
    updateperinput.nom = output.name;
    updateperinput.tel = output.phone;
    if (output.datebirdh) {
      var parts = output.datebirdh.split('/');
      var date = new Date(parts[2], parts[1] - 1, parts[0]);
      updateperinput.dateNaiss = date;
    }
    updateperinput.etatCivil = output.etatcivil;
    updateperinput.adresse = output.address;
    this.personneService.updatePersonne(cand.id, updateperinput);
    console.log('updateperinput:', updateperinput);
  }

  addCompetences(output) {
    var competences0 = output.skills.split('(ubuntu)').join('');
    var competences1 = competences0.split('.\n').join(',');
    var competences2 = competences1.split(',\n').join(','); //replaceAll("\n",",")
    var competences3 = competences2.split('\n,').join(',');
    var competences4 = competences3.split('\n').join(',');
    var competences5 = competences4.split('▪ ').join('');
    var competences6 = competences5.split('- ').join('');
    var competences7 = competences6.split('...').join('');
    var indice = competences7.indexOf('(');
    // console.log('indice', indice);
    if (indice !== -1) {
      var indexe = competences7.indexOf(')');
      // console.log('indexe', indexe);
      if (indexe !== -1) {
        var chaine = competences7.substring(indice, indexe + 1);
        var ind = chaine.indexOf(',');
        if (ind !== -1) {
          // console.log('--chaine', chaine);
          var chaine = chaine.split(',').join('/');
          // console.log('--chaine contient () :', chaine);
          competences7 = competences7.replace(
            competences7.substring(indice, indexe + 1),
            chaine,
          );
          // console.log('**competences contient () apres:', competences7);
        }
      }
    }
    var comps = competences7.split(',');
    // console.log('comps:', comps);
    var C = '';
    for (var i = 0; i < comps.length; i++) {
      // console.log('comp:', comps[i]);
      var index = comps[i].indexOf(': ');
      if (index !== -1) {
        // console.log("c'est un T : C");
        var x = comps[i].split(': ');
        comps[i] = x[1];
        if (i != comps.length - 1) {
          C = C + x[1] + ',';
        } else {
          C = C + x[1];
        }
      }
      if (comps[i][0] == ' ') {
        // console.log("c'est un premier espace");
        comps[i] = comps[i].replace(' ', '');
      }
      var indexe = comps[i].indexOf(':');
      if (indexe == comps[i].length - 1) {
        // console.log("c'est un T:");
      }
      if (index == -1 && indexe == -1) {
        if (i != comps.length - 1) {
          C = C + comps[i] + ',';
        } else {
          C = C + comps[i];
        }
      }
    }
    if (C.indexOf('.') == C.length - 1) {
      // console.log('--point final!');
      C = C.slice(0, -1);
    }
    output.skills = C;
    var competences = output.skills.split(' et ').join(',');
    var competence = competences.split(',');
    var compts = [];
    competence.forEach((comp) => {
      compts.push({ nom: comp });
    });
    return compts;
  }

  addLangues(output) {
    var langues = output.languages.split('\n').join(',');
    var langue = langues.split(' ▪ ').join('');
    var parts = langue.split(',');
    // console.log('parts:', parts);
    var L = '';
    for (var i = 0; i < parts.length; i++) {
      // console.log('part:', parts[i]);
      var indexep = parts[i].indexOf(' : ');
      if (indexep !== -1) {
        // console.log("c'est un :");
        var x = parts[i].split(' :');
        parts[i] = x[0];
        if (i != parts.length - 1) {
          L = L + x[0] + ',';
        } else {
          L = L + x[0];
        }
        // console.log('x[0]**', x[0]);
      }
      var index = parts[i].indexOf(': ');
      if (index !== -1) {
        // console.log("c'est un :");
        var x = parts[i].split(':');
        parts[i] = x[0];
        if (i != parts.length - 1) {
          L = L + x[0] + ',';
        } else {
          L = L + x[0];
        }
        // console.log('x[0]**', x[0]);
      }
      var indexe = parts[i].indexOf(' ');
      if (indexe !== -1) {
        console.log("c'est un espace");
        var x = parts[i].split(' ');
        parts[i] = x[0];
        if (i != parts.length - 1) {
          L = L + x[0] + ',';
        } else {
          L = L + x[0];
        }
        console.log('x[0]**', x[0]);
      }
      var indexp = parts[i].indexOf('(');
      if (indexp !== -1) {
        // console.log("c'est un (");
        var x = parts[i].split('(');
        parts[i] = x[0];
        if (i != parts.length - 1) {
          L = L + x[0] + ',';
        } else {
          L = L + x[0];
        }
        // console.log('x[0]**', x[0]);
      }
      if (index == -1 && indexp == -1 && indexe == -1 && indexep == -1) {
        if (i != parts.length - 1) {
          L = L + parts[i] + ',';
        } else {
          L = L + parts[i];
        }
      }
    }
    return L;
  }

  async getCvsMail() {
    function toUpper(thing) {
      return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
    }

    function findAttachmentParts(struct, attachments?) {
      attachments = attachments || [];
      for (var i = 0, len = struct.length, r; i < len; ++i) {
        if (Array.isArray(struct[i])) {
          findAttachmentParts(struct[i], attachments);
        } else {
          if (
            struct[i].disposition &&
            ['INLINE', 'ATTACHMENT'].indexOf(
              toUpper(struct[i].disposition.type),
            ) > -1
          ) {
            attachments.push(struct[i]);
          }
        }
      }
      return attachments;
    }

    function buildAttMessageFunction(attachment) {
      var dir = 'files/cvs/';
      var filename = dir + attachment.params.name;
      var encoding = attachment.encoding;
      return async function (msg, seqno) {
        var prefix = '(#' + seqno + ') ';
        msg.on('body', async function (stream, info) {
          //Create a write stream so that we can stream the attachment to file;
          console.log(
            prefix + 'Streaming this attachment to file',
            filename,
            info,
          );
          var writeStream = fs.createWriteStream(filename);
          await writeStream.on('finish', function () {
            console.log(prefix + 'Done writing to file %s', filename);
          });
          //stream.pipe(writeStream); this would write base64 data to the file
          //so we decode during streaming using
          if (toUpper(encoding) === 'BASE64') {
            //the stream is base64 encoded, so here the stream is decode on the fly and piped to the write stream (file)
            stream.pipe(new Base64Decode()).pipe(writeStream);
          } else {
            //here we have none or some other decoding streamed directly to the file which renders it useless probably
            stream.pipe(writeStream);
          }
        });
        await msg.once('end', async function () {
          console.log(prefix + 'Finished attachment %s', filename);
          // console.log('attachment:', attachment);
        });
        // await extractCv('files/cvs/', attachment.params.name);
      };
    }
    async function extractCv(inputDir: string, file: string) {
      const outputDir = 'files/compiledFiles';
      await ResumeParser.parseResumeFile(inputDir + file, outputDir) // input file, output dir
        .then(async (file) => {
          console.log('Yay! ' + file);
          //  await addCv(outputDir+'/', file+'.json')
        })
        .catch((error) => {
          console.error(error);
        });
    }

    imap.once('ready', async function () {
      const createCvInput = new CreateCvInput();
      const createperinput = new CreatePersonneInput();
      imap.openBox('INBOX', true, function (err, box) {
        if (err) throw err;
        imap.search(
          ['ALL', ['SINCE', 'June 10, 2020']],
          function (err, results) {
            if (err) throw err;
            var f = imap.fetch(results, {
              bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
              struct: true,
            });
            f.on('message', function (msg, seqno) {
              console.log('Message #%d', seqno);
              var prefix = '(#' + seqno + ') ';
              msg.on('body', function (stream, info) {
                var buffer = '';
                stream.on('data', function (chunk) {
                  buffer += chunk.toString('utf8');
                });
                stream.once('end', function () {
                  console.log(
                    prefix + 'Parsed header: %s',
                    Imap.parseHeader(buffer),
                  );
                });
              });
              msg.once('attributes', async function (attrs) {
                var attachments = findAttachmentParts(attrs.struct);
                console.log(prefix + 'Has attachments: %d', attachments.length);
                for (var i = 0, len = attachments.length; i < len; ++i) {
                  var attachment = attachments[i];
                  var parts = attachment.params.name.split('.');
                  console.log('*****************type:', attachment.subtype);
                  // if (
                  //   // (attachment.params.name.includes('cv') ||
                  //   //   attachment.params.name.includes('CV') ||
                  //   //   attachment.params.name.includes('Cv') ||
                  //   //   attachment.params.name.includes('curriculum')) &&
                  //   parts[1] == 'pdf'
                  // ) {
                  console.log(
                    prefix + 'Fetching attachment %s',
                    attachment.params.name,
                  );
                  var f = imap.fetch(attrs.uid, {
                    //do not use imap.seq.fetch here
                    bodies: [attachment.partID],
                    struct: true,
                  });
                  //build function to process attachment message
                  f.on('message', buildAttMessageFunction(attachment));
                  // }
                }
              });
              msg.once('end', function () {
                console.log(prefix + 'Finished email');
              });
            });
            f.once('error', function (err) {
              console.log('Fetch error: ' + err);
            });
            f.once('end', function () {
              console.log('Done fetching all messages!');
              imap.end();
            });
          },
        );
      });
      return { createCvInput, createperinput };
    });

    imap.once('error', function (err) {
      console.log(err);
    });

    imap.once('end', function () {
      console.log('Connection ended');
    });

    imap.connect();
    return true;
  }

  // ************cv*********************************************************************************************

  async findAllCVs(): Promise<Cv[]> {
    const query = this.cvRepository.createQueryBuilder('cv');
    query
      .leftJoinAndSelect('cv.personne', 'personne')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
    return query.getMany();
  }

  async findOneCV(id: number): Promise<Cv> {
    //return this.cvRepository.findOneOrFail(idCV,{relations: ['certificats','candidatures','experiences','formations','langues','competences','activiteAssociatives','candidat']});
    const query = this.cvRepository.createQueryBuilder('cv');
    query
      .where('cv.id= :id', { id })
      .leftJoinAndSelect('cv.personne', 'personne')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
    return query.getOne();
  }

  async findCvPersonne(idPer: number): Promise<Cv> {
    const query = this.cvRepository.createQueryBuilder('cv');
    query
      .where('personne.id = :idPer', { idPer })
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
    return query.getOne();
  }

  async createCV(createCvInput: CreateCvInput): Promise<Cv> {
    const newCV = this.cvRepository.create(createCvInput);
    return this.cvRepository.save(newCV);
  }

  async updateCV(id: number, updateCVInput: UpdateCvInput): Promise<Cv> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newCV = await this.cvRepository.preload({
      id,
      ...updateCVInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newCV) {
      //si l id n existe pas
      throw new NotFoundException(`CV d'id ${id} n'exsite pas!`);
    }
    return await this.cvRepository.save(newCV);
  }

  async removeCV(idCv: number): Promise<boolean> {
    var supp = false;
    const cv = await this.findOneCV(idCv);
    console.log('cv:', cv);
    const cvtoremove = this.cvRepository.remove(cv);
    if (cvtoremove) {
      supp = true;
    }
    return await supp;
  }

  async findCompetences(): Promise<Cv[]> {
    const query = this.cvRepository.createQueryBuilder('cv');
    query.select('competences'); //.distinct(true)
    return query.getRawOne();
  }

  //***********competence************ */
  async findAllCompetences(): Promise<Competence[]> {
    const query = this.competenceRepository.createQueryBuilder('competence');
    query.select('nom').distinct(true).orderBy('competence.nom');
    // .leftJoinAndSelect('competence.cvs', 'cvs')
    // .leftJoinAndSelect('cvs.personne', 'personne');
    return query.getRawMany();
  }

  async findOneCompetence(idComp: number): Promise<Competence> {
    return this.competenceRepository.findOneOrFail(idComp, {
      relations: ['cvs', 'cvs.personne'],
    });
  }

  async createCompetences(
    createCompetenceInput: CreateCompetenceInput,
  ): Promise<Competence> {
    const newComp = this.competenceRepository.create(createCompetenceInput);
    return this.competenceRepository.save(newComp);
  }

  async updateCompetence(
    id: number,
    updateCompetenceInput: UpdateCompetenceInput,
  ): Promise<Competence> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newCompetence = await this.competenceRepository.preload({
      id,
      ...updateCompetenceInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newCompetence) {
      //si l id n existe pas
      throw new NotFoundException(`Competence d'id ${id} n'exsite pas!`);
    }
    return await this.competenceRepository.save(newCompetence);
  }

  async addCandidature(date, email) {
    var createInput = new CreateCandidatureInput();
    createInput.date = date;
    const cand = await this.personneService.findPerByMail(email);
    createInput.candidatId = cand.id;
    this.personneService.createCandidature(createInput);
  }
}
