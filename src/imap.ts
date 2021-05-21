// var Imap = require('imap'),
//     inspect = require('util').inspect;

// var imap = new Imap({
//   user: 'analyseCvTest@gmail.com',
//   password: 'secret-123',
//   host: 'imap.gmail.com',
//   port: 993,
//   tls: true
// });

// function openInbox(cb) {
//   imap.openBox('INBOX', true, cb);
// }

// imap.once('ready', function() {
//   openInbox(function(err, box) {
//     if (err) throw err;
//     var f = imap.seq.fetch('1:3', {
//       bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//       struct: true
//     });
//     f.on('message', function(msg, seqno) {
//       console.log('Message #%d', seqno);
//       var prefix = '(#' + seqno + ') ';
//       msg.on('body', function(stream, info) {
//         var buffer = '';
//         stream.on('data', function(chunk) {
//           buffer += chunk.toString('utf8');
//         });
//         stream.once('end', function() {
//           console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
//         });
//       });
//       msg.once('attributes', function(attrs) {
//         console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));

//         //Here's were I imagine to need to do another fetch for the content of the message part...

//       });
//       msg.once('end', function() {
//         console.log(prefix + 'Finished');
//       });
//     });
//     f.once('error', function(err) {
//       console.log('Fetch error: ' + err);
//     });
//     f.once('end', function() {
//       console.log('Done fetching all messages!');
//       imap.end();
//     });
//   });
// });

// imap.once('error', function(err) {
//   console.log(err);
// });

// imap.once('end', function() {
//   console.log('Connection ended');
// });

// imap.connect();

// // var onEnd = function (result) {
// //     if (result.error) {
// //       console.log(result.error)
// //       return
// //     }
// //     console.log("done")
// //     console.log(result.latestTime)
// //   }
   
// //   var downloadEmailAttachments = require('download-email-attachments');
// //   downloadEmailAttachments({
// //     invalidChars: /[^A-Z]/g, //Regex of Characters that are invalid and will be replaced by X
// //     account: '"analyseCvTest@mail.com":secret-123@imap-server.com:123', // all options and params besides account are optional
// //     directory: './files',
// //     filenameTemplate: '{day}-{filename}',
// //     filenameFilter: /.xlsx?$/,
// //     timeout: 3000,
// //     log: {warn: console.warn, debug: console.info, error: console.error, info: console.info },
// //     since: '2015-01-12',
// //     lastSyncIds: ['234', '234', '5345'], // ids already dowloaded and ignored, helpful because since is only supporting dates without time
// //     attachmentHandler: function (attachmentData, callback, errorCB) {
// //       console.log(attachmentData)
// //       callback()
// //     }
// //   }, onEnd)


// openInbox(function(err, box) {
//   if (err) throw err;
//   imap.search([ 'UNSEEN', ['SINCE', 'May 20, 2010'] ], function(err, results) {
//     if (err) throw err;
//     var f = imap.fetch(results, { bodies: '' });
//     f.on('message', function(msg, seqno) {
//       console.log('Message #%d', seqno);
//       var prefix = '(#' + seqno + ') ';
//       msg.on('body', function(stream, info) {
//         console.log(prefix + 'Body');
//         stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
//       });
//       msg.once('attributes', function(attrs) {
//         console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
//       });
//       msg.once('end', function() {
//         console.log(prefix + 'Finished');
//       });
//     });
//     f.once('error', function(err) {
//       console.log('Fetch error: ' + err);
//     });
//     f.once('end', function() {
//       console.log('Done fetching all messages!');
//       imap.end();
//     });
//   });
// });