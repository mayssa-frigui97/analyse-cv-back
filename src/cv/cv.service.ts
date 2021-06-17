/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { readFile, writeFile, readdir, unlink, createWriteStream } from 'fs';
import { StatutCV } from 'src/enum/StatutCV';
import { PersonneService } from 'src/candidat/personne.service';
import { CreatePersonneInput } from 'src/candidat/dto/create-personne.input';
import { Competence } from './entities/competence.entity';
import { UpdateCompetenceInput } from './dto/update-competence.input';
import { CreateCompetenceInput } from './dto/create-competence.input';
import { Personne } from 'src/candidat/entities/personne.entity';

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

const path = require('path');
const os = require('os');

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    private personneService: PersonneService,
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

  async extractOneCv(file): Promise<boolean> {
    const inputDir = 'files/cvs/';
    const outputDir = 'files/extractedCvLocal';
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
        let cv: Cv;
        await this.findCvByMail(output.email).then((result) => {
          cv = result;
        });
        if (!cv) {
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
          createcvinput.competences = compts;
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
            // var indexe = parts[i].indexOf(' ');
            // if (indexe !== -1) {
            //   console.log("c'est un espace");
            //   var x = parts[i].split(' ');
            //   parts[i] = x[0];
            //   if (i != parts.length - 1) {
            //     L = L + x[0] + ',';
            //   } else {
            //     L = L + x[0];
            //   }
            //   console.log('x[0]**', x[0]);
            // }
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
          output.languages = L;
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
        } else {
          // console.log("Personne",output.name,"déja existe!")
        }
      }
    });
    return true;
  }

  async createCvs(): Promise<boolean> {
    let cvInput: CreateCvInput;
    let perInput: CreatePersonneInput;
    this.getCvsMail();
    // .then(({createper,createCv})=>{
    //   await this.createCV(createCv).then(async (cv)=>{
    //     createper.cvId=cv.id;
    //     await this.personneService.createPersonne(createper);
    // console.log("**cv crée:",cv);
    // console.log("**personne crée:",createper);
    // cvInput=createCv;
    // perInput =createper;
    // });
    setTimeout(async () => {
      const cv = this.createCV(cvInput);
      perInput.cvId = (await cv).id;
      const per = this.personneService.createPersonne(perInput);
      console.log('**cv crée:', cv);
      console.log('**personne crée:', per);
    }, 10000);
    return true;
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

          //stream.pipe(writeStream); this would write base64 data to the file.
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
        });
        await extractCv('files/cvs/', attachment.params.name);
      };
    }
    async function extractCv(inputDir: string, file: string) {
      const outputDir = 'files/compiledFiles';
      const cv = new CreateCvInput();
      const personne = new CreatePersonneInput();
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
          ['ALL', ['SINCE', 'June 15, 2021']],
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
                  // console.log('parts:', parts);
                  if (
                    (attachment.params.name.includes('cv') ||
                      attachment.params.name.includes('CV') ||
                      attachment.params.name.includes('Cv') ||
                      attachment.params.name.includes('curriculum')) &&
                    parts[1] == 'pdf'
                  ) {
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
                  }
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

  async findCvByMail(email: string): Promise<Cv> {
    const query = this.cvRepository.createQueryBuilder('cv');
    query
      .where('personne.email= :email', { email })
      .leftJoinAndSelect('cv.personne', 'personne')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
    return query.getOne();
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
}
