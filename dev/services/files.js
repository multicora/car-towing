// TODO: check max size
// TODO: check extension

'use strict';

const fs = require('fs');
const glob = require('glob');
const uuid = require('node-uuid');
const Promise = require('promise');

module.exports = config => {
  config = config || {};

  const folder = 'uploads';
  const separator = '_';

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  return {
    setFile(request, cb) {
      return new Promise((resolve, reject) => {
        const data = request.payload;

        if (data.file) {
          const name = data.file.hapi.filename;
          const id = uuid.v1();
          const path = folder + '/' + id + separator + name;
          const file = fs.createWriteStream(path);

          file.on('error', err => cb(err));
          data.file.pipe(file);
          data.file.on('end', err => cb(null, id));
        }
      });
    },
    saveFromBase64: (base64Data, ext, cb) => {
      const id = uuid.v1();
      const path = folder + '/' + id + separator + '.' + ext;
      console.log('path');
      console.log(path);
      fs.writeFile(path, base64Data, 'base64', err => cb(err, id));
    },
    getFile(id, cb) {
      return new Promise((resolve, reject) => {
        const path = folder + '/' + id + separator;

        glob(path + '*', {}, (err, files) => {
          err ? reject(err) : resolve(files[0]);
          cb && cb(err, files);
        });
      });
    },
    removeFile(id, cb) {
      return new Promise((resolve, reject) => {
        const path = folder + '/' + id + separator;

        glob(path + '*', {nonull: true}, (err, files) => {
          if (!err) {
            const filesPromises = files.map(
              file => new Promise((resolve, reject) => fs.unlink(file, resolve))
            );

            Promise.all(filesPromises).then(res => {
              resolve();
              cb && cb(null);
            });
          } else {
            reject(err);
            cb && cb(err);
          }
        });
      });
    }
  };
};
