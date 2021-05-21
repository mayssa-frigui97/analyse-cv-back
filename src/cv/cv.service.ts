import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiviteAssociative } from './entities/activite.associative.entity';
import { Langue } from './entities/langue.entity';
import { Formation } from './entities/formation.entity';
import { Experience } from './entities/experience.entity';
import { Competence } from './entities/competence.entity';
import { Certificat } from './entities/certificat.entity';
import { Cv } from './entities/cv.entity';
import { CreateCvInput } from './dto/create-cv.input';
import { UpdateCvInput } from './dto/update-cv.input';
import { UpdateCertifInput } from './dto/update-certif-input';
import { UpdateActAssocInput } from './dto/update-act-assoc-input';
import { UpdateLangueInput } from './dto/update-langue-input';
import { UpdateFormationInput } from './dto/update-formation-input';
import { UpdateExperienceInput } from './dto/update-experience-input';
import { UpdateCompetenceInput } from './dto/update-competence-input';
import Pdf from './pdfExport';
import { readFile, writeFile , readdir} from 'fs';
import { fromPath } from "pdf2pic";


// var Imap = require('imap'),
//     inspect = require('util').inspect;

var inspect = require('util').inspect;
var fs = require('fs');
const { Base64Decode } = require('base64-stream');
var Imap = require('node-imap');
var pdf2img = require('pdf2img');
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
    @InjectRepository(Certificat)
    private certificatRepository: Repository<Certificat>,
    @InjectRepository(Competence)
    private competenceRepository: Repository<Competence>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
    @InjectRepository(Langue)
    private langueRepository: Repository<Langue>,
    @InjectRepository(ActiviteAssociative)
    private actRepository: Repository<ActiviteAssociative>,
  ) {}

  /***************Cv*********/

  async extractCvAPI():Promise<boolean>{
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
    // From file to file
    // const inputFile= "files/Alice Clark CV.pdf";
    // const outputDir = 'files/compiledFiles';
    // ResumeParser.parseResumeFile('files/cvs/' + inputFile, outputDir) // input file, output dir
    //   .then((file) => {
    //     console.log('Yay! ' + file);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // return true;
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

  async findAllCVs(): Promise<Cv[]> {
    //return this.cvRepository.find({relations: ['certificats','candidatures','experiences','formations','langues','competences','activiteAssociatives','candidat']});
    const query = this.cvRepository.createQueryBuilder('cv');
    query
      .leftJoinAndSelect('cv.langues', 'langues')
      .leftJoinAndSelect('cv.formations', 'formations')
      .leftJoinAndSelect('cv.experiences', 'experiences')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('cv.certificats', 'certificats')
      .leftJoinAndSelect('cv.activiteAssociatives', 'activiteAssociatives')
      .leftJoinAndSelect('cv.personne', 'personne')
      .leftJoinAndSelect('personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
    return query.getMany();
  }

  async findPostes(): Promise<Cv[]> {
    const query = this.cvRepository.createQueryBuilder('cv');
    query.select('posteAct').where('cv.posteAct <> ""').distinct(true);
    return query.getRawMany();
  }

  async findOneCV(id: number): Promise<Cv> {
    //return this.cvRepository.findOneOrFail(idCV,{relations: ['certificats','candidatures','experiences','formations','langues','competences','activiteAssociatives','candidat']});
    const query = this.cvRepository.createQueryBuilder('cv');
    query
      .where('cv.id= :id', { id })
      .leftJoinAndSelect('cv.langues', 'langues')
      .leftJoinAndSelect('cv.formations', 'formations')
      .leftJoinAndSelect('cv.experiences', 'experiences')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('cv.certificats', 'certificats')
      .leftJoinAndSelect('cv.activiteAssociatives', 'activiteAssociatives')
      .leftJoinAndSelect('cv.personne', 'personne')
      .leftJoinAndSelect('personne.candidatures', 'candidatures')
      .leftJoinAndSelect('candidatures.entretiens', 'entretiens');
    return query.getOne();
  }

  async findCvCandidat(idPer: number): Promise<Cv> {
    const query = this.cvRepository.createQueryBuilder('cv');
    query
      .where('personne.id = :idPer', { idPer })
      .leftJoinAndSelect('cv.langues', 'langues')
      .leftJoinAndSelect('cv.personne', 'personne')
      .leftJoinAndSelect('cv.formations', 'formations')
      .leftJoinAndSelect('cv.experiences', 'experiences')
      .leftJoinAndSelect('cv.competences', 'competences')
      .leftJoinAndSelect('cv.certificats', 'certificats')
      .leftJoinAndSelect('cv.activiteAssociatives', 'activiteAssociatives')
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

  /***************Certificat*********/
  async findAllCertificats(): Promise<Certificat[]> {
    return this.certificatRepository.find({
      relations: ['cvs', 'cvs.personne'],
    });
  }

  async findOneCertificat(idCertif: number): Promise<Certificat> {
    return this.certificatRepository.findOneOrFail(idCertif, {
      relations: ['cvs', 'cvs.personne'],
    });
  }

  async updateCertif(
    id: number,
    updateCertifInput: UpdateCertifInput,
  ): Promise<Certificat> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newCertif = await this.certificatRepository.preload({
      id,
      ...updateCertifInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newCertif) {
      //si l id n existe pas
      throw new NotFoundException(`certificat d'id ${id} n'exsite pas!`);
    }
    return await this.certificatRepository.save(newCertif);
  }

  /***************Competence*********/
  async findAllCompetences(): Promise<Competence[]> {
    const query = this.competenceRepository.createQueryBuilder('competence');
    query.select('nom').distinct(true);
    return query.getRawMany();
  }

  async findOneCompetence(idComp: number): Promise<Competence> {
    return this.competenceRepository.findOneOrFail(idComp, {
      relations: ['cvs', 'cvs.personne'],
    });
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

  /***************Experience*********/
  async findAllExperiences(): Promise<Experience[]> {
    return this.experienceRepository.find({
      relations: ['cvs', 'cvs.personne'],
    });
  }

  async findOneExperience(idExp: number): Promise<Experience> {
    return this.experienceRepository.findOneOrFail(idExp, {
      relations: ['cvs', 'cvs.personne'],
    });
  }

  async updateExperience(
    id: number,
    updateExperienceInput: UpdateExperienceInput,
  ): Promise<Experience> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newExperience = await this.experienceRepository.preload({
      id,
      ...updateExperienceInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newExperience) {
      //si l id n existe pas
      throw new NotFoundException(`experience d'id ${id} n'exsite pas!`);
    }
    return await this.experienceRepository.save(newExperience);
  }
  /***************Formation*********/
  async findUniverFormations(): Promise<Formation[]> {
    const query = this.formationRepository.createQueryBuilder('formation');
    query
      .select('universite')
      .where("formation.universite NOT LIKE 'Lycée%'")
      .distinct(true);
    return query.getRawMany();
  }

  async findSpecFormations(): Promise<Formation[]> {
    const query = this.formationRepository.createQueryBuilder('formation');
    query.select('specialite').distinct(true);
    return query.getRawMany();
  }

  async findNivFormations(): Promise<Formation[]> {
    const query = this.formationRepository.createQueryBuilder('formation');
    query
      .select('niveau')
      .where("formation.universite NOT LIKE 'Baccalauréat%'")
      .distinct(true);
    return query.getRawMany();
  }

  async findOneFormation(idForm: number): Promise<Formation> {
    return this.formationRepository.findOneOrFail(idForm, {
      relations: ['cvs', 'cvs.personne'],
    });
  }

  async updateFormation(
    id: number,
    updateFormationInput: UpdateFormationInput,
  ): Promise<Formation> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newFormation = await this.formationRepository.preload({
      id,
      ...updateFormationInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newFormation) {
      //si l id n existe pas
      throw new NotFoundException(`Formation d'id ${id} n'exsite pas!`);
    }
    return await this.formationRepository.save(newFormation);
  }

  /***************Langue*********/
  async findAllLangues(): Promise<Langue[]> {
    const query = this.langueRepository.createQueryBuilder('langue');
    query.select('nom').distinct(true);
    return query.getRawMany();
  }

  async findOneLangue(idLang: number): Promise<Langue> {
    return this.langueRepository.findOneOrFail(idLang, {
      relations: ['cvs', 'cvs.personne'],
    });
  }

  async updateLangue(
    id: number,
    updateLangueInput: UpdateLangueInput,
  ): Promise<Langue> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newLangue = await this.langueRepository.preload({
      id,
      ...updateLangueInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newLangue) {
      //si l id n existe pas
      throw new NotFoundException(`Langue d'id ${id} n'exsite pas!`);
    }
    return await this.langueRepository.save(newLangue);
  }

  /***************Activite associative*********/
  async findAllActs(): Promise<ActiviteAssociative[]> {
    return this.actRepository.find({ relations: ['cvs', 'cvs.personne'] });
  }

  async findOneAct(idAct: number): Promise<ActiviteAssociative> {
    return this.actRepository.findOneOrFail(idAct, {
      relations: ['cvs', 'cvs.personne'],
    });
  }

  async updateAct(
    id: number,
    updateActAssocInput: UpdateActAssocInput,
  ): Promise<ActiviteAssociative> {
    //on recupere le personne d'id id et on replace les anciennes valeurs par celles du personne passées en parametres
    const newAct = await this.actRepository.preload({
      id,
      ...updateActAssocInput,
    });
    //et la on va sauvegarder la nv entité
    if (!newAct) {
      //si l id n existe pas
      throw new NotFoundException(`act associative d'id ${id} n'exsite pas!`);
    }
    return await this.actRepository.save(newAct);
  }
}
