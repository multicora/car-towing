// TODO: check max size
// TODO: check extension

'use strict';

const fs = require('fs');
const glob = require("glob");
const uuid = require('node-uuid');

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