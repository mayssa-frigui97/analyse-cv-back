import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import Pdf from './pdfExport';
import { readFile, writeFile , readdir} from 'fs';
import { StatutCV } from 'src/enum/StatutCV';
import { PersonneService } from 'src/candidat/personne.service';
import { CreatePersonneInput } from 'src/candidat/dto/create-personne.input';
import { Competence } from './entities/competence.entity';
import { UpdateCompetenceInput } from './dto/update-competence.input';
import { CreateCompetenceInput } from './dto/create-competence.input';


// var Imap = require('imap'),
//     inspect = require('util').inspect;

var inspect = require('util').inspect;
var fs = require('fs');
const { Base64Decode } = require('base64-stream');
var Imap = require('node-imap');
var pdf2img = require('pdf2img');
const ResumeParser = require('./../../src');
var gravatar = require('gravatar');
var crypto=require('crypto');

var imap = new Imap({
  user: 'analysecvtest@gmail.com',
  password: 'secret-123',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  authTimeout: 20000,
  connTimeout: 20000,
});

const pdfExport = require('./pdfExport');
const path = require('path');

// const PdfExtractor = require('pdf-extractor').PdfExtractor;
// const CanvasRenderer = require('pdf-extractor/lib/renderer/CanvasRenderer');
// const SvgRenderer = require('pdf-extractor/lib/renderer/SvgRenderer');
// // var FileWriter = require('./FileWriter');

// class FileWriter
// {
//   outputDir;
//   options;
// 	constructor(outputDir, fsWriteOptions) {
// 		this.outputDir = outputDir;
// 		this.options = fsWriteOptions || { encoding: 'utf8' };
// 	}

// 	getPagePath(pageNum, fileExt) {
// 		let name;
// 		switch (fileExt) {
// 			case 'html':
// 			case 'txt':
// 				name = 'text';
// 				break;
// 			default:
// 				name = 'page';
// 		}
// 		return this.getPathForFile(`${name}-${pageNum}.${fileExt}`);
// 	}

// 	getPathForFile(fileName) {
// 		return path.join(this.outputDir, fileName);
// 	}

// 	writeStringToFile(string, filePath) {
// 		return new Promise((resolve, reject) => {
// 			fs.writeFile(filePath,
// 				string,
// 				this.options,
// 				(err) => err === null ? resolve(filePath) : reject(err)
// 			)
// 		})
// 	}

// 	writeStreamToFile(readableStream, filePath) {
// 		let writableStream = fs.createWriteStream(filePath, this.options);

// 		readableStream.pipe(writableStream);

// 		return new Promise(function(resolve, reject) {
// 			readableStream.once('error', reject);
// 			writableStream.once('error', reject);
// 			writableStream.once('finish', resolve);
// 		}).catch(function(err) {
// 			readableStream = null; // Explicitly null because of v8 bug 6512.
// 			writableStream.end();
// 			throw err;
// 		});
// 	};
// }

// class JPGWriter extends FileWriter {
//   getFilePathForPage(page) {
//     return super.getPagePath(page.pageNumber, 'png');
//   }

//   writeCanvasPage(page, viewport, canvas) {
//     return this.writeStreamToFile(
//       canvas.jpgStream(),
//       this.getFilePathForPage(page),
//     );
//   }
// }

// class JPGCanvasRenderer extends CanvasRenderer {
//   getWriters(writerOptions) {
//     let writers = super.getWriters(writerOptions);
//     writers.push(new JPGWriter(this.outputDir, writerOptions));
//     return writers;
//   }
// }

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    private personneService : PersonneService,
    @InjectRepository(Competence)
    private competenceRepository: Repository<Competence>
  ) {}

  /***************Cv*********/

  async getAvatar(email: string){

      // const size = 200;
      // const defaults = 'retro';
    
      // if (!email) {
      //   return 'https://gravatar.com/avatar/?s=' + size + '&d=' + defaults;
      // }
    
      // var md5 = crypto.createHash('md5').update(email);
      // return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;

    // var result: string[];
    // var url = gravatar.url(email, {s: '200', r: 'pg', d: '404'});
    // var unsecureUrl = gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, false);
    // var Url = gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, true);
    // var httpUrl = gravatar.url(email, {protocol: 'http', s: '100'});
    // var httpsUrl = gravatar.url(email, {protocol: 'https', s: '100'})
    // var profile2 = gravatar.profile_url(email, {protocol: 'http', format:'qr'});
    // result=url+unsecureUrl+Url+httpUrl+httpsUrl+profile2;
    // console.log("result:",result,"url:",url)
    // return url;
    // let directory_input = 'files/compiledFiles/';
    // let directory_output = 'files/imgs/';
    // server.get('https://pdfcandy.com/fr/result/18c506e020ec6dab.html', function(request, response) {
    //   var p1 = request.param(directory_input  + 'cv.pdf'); 
    //   console.log(p1);
    //   response.sendFile( directory_output  + 'cv.pdf');
    // });
  }
  async addCvs():Promise<boolean>{
    let directory_name = 'files/compiledFiles/';
    await readdir(directory_name, (err,files) => {
      if (err) throw err;
      console.log('******Répertoire: ',directory_name,"*****files:",files);
      for (const file of files){
        let rawdata = fs.readFileSync(directory_name+ file);
        let output = JSON.parse(rawdata);
        var createcvinput = new CreateCvInput();
        createcvinput.statutCV=StatutCV.RECU;
        createcvinput.cmptLinkedin= output.profiles;
        createcvinput.activiteAssociatives=output.ActAssociatives;
        createcvinput.experiences=output.experience;
        createcvinput.formations=output.education;;
        createcvinput.certificats=output.certification;
        createcvinput.interets=output.interests;
        createcvinput.projets=output.projects;
        var skills0 = output.skills.split("(ubuntu)").join("");
        var skills1 = skills0.split(".\n").join(",");
        var skills2 = skills1.split(",\n").join(",");//replaceAll("\n",",")
        var skills3 = skills2.split("\n,").join(",");
        var skills4 = skills3.split("\n").join(",");
        var skills5 = skills4.split("▪ ").join("");
        var skills6 = skills5.split("- ").join("");
        var skills7 = skills6.split("...").join("");
          var indice = skills7.indexOf("(")
          console.log("indice",indice);
          if(indice !== -1){
            var indexe = skills7.indexOf(")")
            console.log("indexe",indexe);
            if(indexe !== -1){
              var chaine= skills7.substring(indice,indexe+1);
              var ind= chaine.indexOf(",");
              if(ind !== -1){
                console.log("--chaine",chaine);
                var chaine = chaine.split(",").join("/");
                console.log("--chaine contient () :",chaine);
                skills7 = skills7.replace(skills7.substring(indice,indexe+1),chaine)
                console.log("**skills contient () apres:",skills7);
              }
            }
          }
        var comps = skills7.split(",");
        console.log("comps:",comps);
        var C: string="";
        for(var i = 0; i < comps.length; i++){
          console.log("comp:",comps[i])
          var index = comps[i].indexOf(": ");    
          if(index !== -1){
            console.log("c'est un T : C");
            var x=comps[i].split(": ");
            comps[i]=x[1];
            if(i!=comps.length-1){
              C=C+x[1]+",";
            }
            else{
              C=C+x[1];
            }
            console.log("x[1]**",x[1])
          }    
          if(comps[i][0] == " "){
            console.log("c'est un premier espace");
            comps[i]=comps[i].replace(" ","");
            console.log("comps[i]**",comps[i])
          }
          var indexe = comps[i].indexOf(":");    
          if(indexe == comps[i].length-1){
            console.log("c'est un T:");
            console.log("comps[i].length-1**",comps[i].length-1)
          }
          if(index == -1 && indexe == -1){
            if(i!=comps.length-1){
              C=C+comps[i]+",";
            }
            else{
              C=C+comps[i];
            }
          }
          console.log("compétences**",C)
        }
        if(C.indexOf(".") == (C.length)-1){
          console.log("--point final!")
          C=C.slice(0, -1);
          console.log("compétences**",C)
        }
        output.skills=C;
        var competences = output.skills.split(" et ").join(",");
        var competence = competences.split(",");
        var compts = [];
        competence.forEach(comp => {
            compts.push({nom:comp});
          });
        console.log("compts:",compts);
        createcvinput.skills=compts;
        createcvinput.competences=competences;
        var langues = output.languages.split("\n").join(",");
        var langue = langues.split(" ▪ ").join("");
        var parts=langue.split(",");
        console.log("parts:",parts);
        var L: string="";
        for(var i = 0; i < parts.length; i++){
          console.log("part:",parts[i])
          var indexep = parts[i].indexOf(" : ");    
          if(indexep !== -1){
            console.log("c'est un :");
            var x=parts[i].split(" :");
            parts[i]=x[0];
            if(i!=parts.length-1){
              L=L+x[0]+",";
            }
            else{
              L=L+x[0];
            }
            console.log("x[0]**",x[0])
          }
          var index = parts[i].indexOf(": ");    
          if(index !== -1){
            console.log("c'est un :");
            var x=parts[i].split(":");
            parts[i]=x[0];
            if(i!=parts.length-1){
              L=L+x[0]+",";
            }
            else{
              L=L+x[0];
            }
            console.log("x[0]**",x[0])
          }
          var indexe = parts[i].indexOf(" ");    
          if(indexe !== -1){
            console.log("c'est un espace");
            var x=parts[i].split(" ");
            parts[i]=x[0];
            if(i!=parts.length-1){
              L=L+x[0]+",";
            }
            else{
              L=L+x[0];
            }
            console.log("x[0]**",x[0])
          }
          var indexp = parts[i].indexOf("(");    
          if(indexp !== -1){
            console.log("c'est un (");
            var x=parts[i].split("(");
            parts[i]=x[0];
            if(i!=parts.length-1){
              L=L+x[0]+",";
            }
            else{
              L=L+x[0];
            }
            console.log("x[0]**",x[0])
          }
          if(index == -1 && indexp == -1 && indexe == -1 && indexep == -1){
            if(i!=parts.length-1){
              L=L+parts[i]+",";
            }
            else{
              L=L+parts[i];
            }
          }
          console.log("langue**",L)
        }
        output.languages=L;
        createcvinput.langues=output.languages;
        console.log("langue :",createcvinput.langues)
        this.createCV(createcvinput).then((cv)=>{
          console.log("cv create:",cv);
          var createperinput = new CreatePersonneInput();
          createperinput.nom=output.name;
          createperinput.email= output.email;
          createperinput.tel= output.phone;
          console.log("output.dateBirth:",output.datebirdh)
          if(output.datebirdh){
            var parts = output.datebirdh.split("/");
            var date = new Date(parts[2], parts[1] - 1, parts[0]);
            console.log("+parts[2]:",+parts[2],"+parts[1] - 1",+parts[1] - 1,"+parts[0]:",+parts[0],"parts[0]:",parts[0],"parts[1]:",parts[1],"parts[2]:",parts[2])
            createperinput.dateNaiss = date;
          }
          else{
            var date = new Date("1899-11-29T23:46:24.000Z");
            createperinput.dateNaiss = date;
            console.log("date:",date)
          }
          createperinput.etatCivil= output.etatcivil;
          createperinput.adresse = output.address;
          createperinput.cvId = cv.id;
          this.personneService.createPersonne(createperinput);
          console.log("perinput:",createperinput);
          })
        console.log("cvinput:",createcvinput);
      }
    });
    return true;
  }
  // async extractImg(): Promise<boolean> {
  //   let outputDir = '/path/to/output',
  //     pdfExtractor = new PdfExtractor(outputDir, {
  //       renderers: [
  //         new JPGCanvasRenderer(outputDir, rendererOptions),
  //         new SvgRenderer(outputDir, rendererOptions),
  //       ],
  //     });

  //   pdfExtractor
  //     .parse('/path/to/dummy.pdf')
  //     .then(function () {
  //       console.log('# End of Document');
  //     })
  //     .catch(function (err) {
  //       console.error('Error: ' + err);
  //     });
  //     return true;
  // }

  async getTextPdf():Promise<boolean>{
    let directory_name = 'files/cvs/';
    await readdir(directory_name, (err,files) => {
      if (err) throw err;
      console.log('******Répertoire: ',directory_name,"*****files:",files);
      for (const file of files){
        console.log(file);
        readFile(directory_name+ file, async (err, data) => {
          if (err) {
            console.log(err);
            return false;
          } else {
            console.log('Data: ', data);
            const pdfText = await Pdf.getPDFText(data);
            console.log('text: ', pdfText);
            // file.split('.').slice(0, -1).join('.');
            writeFile('files/txt/'+path.parse(file).name+'.txt', pdfText, (err) => {
              if (err) throw err;
              console.log('***The file: '+path.parse(file).name+' has been saved!');
            });
            return true;
          }
        });
      }
    });
    return true;
  }


  async extractCv(): Promise<boolean> {
    let inputDir = 'files/cvs/';
    let outputDir = 'files/compiledFiles'; 
    await readdir(inputDir, (err, files) => 
    { 
      if (err) throw err;
        console.log('******Répertoire: ', inputDir, '*****files:', files); 
        for (const file of files) 
        { 
          ResumeParser.parseResumeFile(inputDir + file, outputDir) // input file, output dir 
          .then((file) => 
          { 
            console.log('Yay! ' + file); 
          }) 
          .catch((error) => 
          { 
            console.error(error); 
          }); 
        } 
      }); 
    return true;
  }

  async getCvsMail(): Promise<boolean> {
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
      // if(filename.includes("cv")){

      return function (msg, seqno) {
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function (stream, info) {
          //Create a write stream so that we can stream the attachment to file;
          console.log(
            prefix + 'Streaming this attachment to file',
            filename,
            info,
          );
          var writeStream = fs.createWriteStream(filename);
          writeStream.on('finish', function () {
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
        msg.once('end', function () {
          console.log(prefix + 'Finished attachment %s', filename);
        });
      };
      // }
    }
    // ,['HEADER', 'SUBJECT', 'candidature']
    imap.once('ready', function () {
      imap.openBox('INBOX', true, function (err, box) {
        if (err) throw err;
        imap.search(
          ['ALL', ['SINCE', 'May 20, 2010']],
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
              msg.once('attributes', function (attrs) {
                var attachments = findAttachmentParts(attrs.struct);
                console.log(prefix + 'Has attachments: %d', attachments.length);
                for (var i = 0, len = attachments.length; i < len; ++i) {
                  var attachment = attachments[i];
                  if (
                    attachment.params.name.includes('cv') ||
                    attachment.params.name.includes('CV') ||
                    attachment.params.name.includes('Cv') ||
                    attachment.params.name.includes('curriculum')
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
    });

    imap.once('error', function (err) {
      console.log(err);
    });

    imap.once('end', function () {
      console.log('Connection ended');
    });

    imap.connect();
    return await true;
  }

  // ************cv*********************************************************************************************

  async findAllCVs(): Promise<Cv[]> {
    const query = this.cvRepository.createQueryBuilder('cv');
    query
      .leftJoinAndSelect('cv.personne', 'personne')
      .leftJoinAndSelect('cv.skills', 'skills')
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
      .leftJoinAndSelect('cv.skills', 'skills')
      .leftJoinAndSelect('personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
    return query.getOne();
  }

  async findCvPersonne(idPer: number): Promise<Cv> {
    const query = this.cvRepository.createQueryBuilder('cv');
    query
      .where('personne.id = :idPer', { idPer })
      .leftJoinAndSelect('cv.skills', 'skills')
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
    query.select('competences');//.distinct(true)
    return query.getRawOne();
  }

  //***********competence************ */
  async findAllCompetences(): Promise<Competence[]> {
    const query = this.competenceRepository.createQueryBuilder('competence');
    query.select('nom').distinct(true).orderBy("competence.nom")
    // .leftJoinAndSelect('competence.cvs', 'cvs')
    // .leftJoinAndSelect('cvs.personne', 'personne');
    return query.getRawMany();
  }

  async findOneCompetence(idComp: number): Promise<Competence> {
    return this.competenceRepository.findOneOrFail(idComp, {
      relations: ['cvs', 'cvs.personne'],
    });
  }

  async createCompetences(createCompetenceInput: CreateCompetenceInput): Promise<Competence> {
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
