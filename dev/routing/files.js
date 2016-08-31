// TODO: check max size
// TODO: check extension

'use strict';

const path = require('path');
const fs = require('fs');
const glob = require("glob");
const uuid = require('node-uuid');

// module.exports = function (server, config) {
//   config = config || {};

//   const folder = config.folder || 'uploads';

//   if (!fs.existsSync(folder)){
//     fs.mkdirSync(folder);
//   }

//   server.route({
//     method: 'POST',
//     path: '/api/file',
//     config: {

//       payload: {
//         output: 'stream',
//         parse: true,
//         allow: 'multipart/form-data'
//       },

//       handler: function (request, reply) {
//         const data = request.payload;

//         if (data.file) {
//           const name = data.file.hapi.filename;
//           const path = folder + '/' + name;
//           const file = fs.createWriteStream(path);

//           file.on('error', function (err) {
//             reply( Boom.badRequest('Error while file uploading', err) );
//           });

//           data.file.pipe(file);

//           data.file.on('end', function (err) { 
//             const ret = {
//               filename: data.file.hapi.filename,
//               headers: data.file.hapi.headers
//             }
//             reply(JSON.stringify(ret));
//           })
//         }

//       }
//     }
//   });
// };

module.exports = function (config) {
  config = config || {};

  const folder = config.folder || 'uploads';
  const separator = '_';

  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }

  return {
    setFile: (request, cb) => {
      const data = request.payload;

      if (data.file) {
        const name = data.file.hapi.filename;
        const id = uuid.v1();
        const path = folder + '/' + id + separator + name;
        const file = fs.createWriteStream(path);

        file.on('error', function (err) {
          cb(err);
        });

        data.file.pipe(file);

        data.file.on('end', function (err) {
          cb(null, id);
        })
      }
    },
    getFile: (id, cb) => {
      const path = folder + '/' + id + separator;

      glob(path + '*', {nonull:true}, function (er, files) {
        cb(err, files);
      });
    }
  }
}