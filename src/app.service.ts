import { Injectable } from '@nestjs/common';

// var Imap = require('imap'),
//     inspect = require('util').inspect;

//   var imap = new Imap({
//     user: 'analyseCvTest@gmail.com',
//     password: 'secret-123',
//     host: 'imap.gmail.com',
//     port: 993,
//     tls: true
//   });

//   Nom de serveur : outlook.office365.com
//   Port : 993
//   Méthode de chiffrement : TLS
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(){}

//   async connect():Promise<boolean>{
//   function openInbox(cb) {
//     imap.openBox('INBOX', true, cb);
//   }

//   imap.once('ready', function() {
//     openInbox(function(err, box) {
//       if (err) throw err;
//       var f = imap.seq.fetch('1:3', {
//         bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//         struct: true
//       });
//       f.on('message', function(msg, seqno) {
//         console.log('Message #%d', seqno);
//         var prefix = '(#' + seqno + ') ';
//         msg.on('body', function(stream, info) {
//           var buffer = '';
//           stream.on('data', function(chunk) {
//             buffer += chunk.toString('utf8');
//           });
//           stream.once('end', function() {
//             console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
//           });
//         });
//         msg.once('attributes', function(attrs) {
//           console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));

//           //Here's were I imagine to need to do another fetch for the content of the message part...

//         });
//         msg.once('end', function() {
//           console.log(prefix + 'Finished');
//         });
//       });
//       f.once('error', function(err) {
//         console.log('Fetch error: ' + err);
//       });
//       f.once('end', function() {
//         console.log('Done fetching all messages!');
//         imap.end();
//       });
//     });
//   });

//   imap.once('error', function(err) {
//     console.log(err);
//   });

//   imap.once('end', function() {
//     console.log('Connection ended');
//   });

//   imap.connect();
//   if(imap.connect()){
//       return await true;
//   }
//   else { return await false}
// }
}
