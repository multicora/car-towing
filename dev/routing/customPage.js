// Custom pages
'use strict';

const files = require('../services/files.js')();
const DAL = require('../dal/dal.js');
const Boom = require('boom');
const _ = require('lodash');
const sanitizeHtml = require('sanitize-html');

module.exports = function (server) {
  // server.route({
  //   method: 'GET',
  //   path: '/gotTowedEdit',
  //   handler: function (request, reply) {
  //     reply.file( path.resolve(__dirname, './public/gotTowed/markupEdit.html') );
  //   }
  // });

  // server.route({
  //   method: 'GET',
  //   path: '/gotTowed',
  //   handler: function (request, reply) {
  //     reply.file( path.resolve(__dirname, './public/gotTowed/markup.html') );
  //   }
  // });

  server.route({
    method: 'GET',
    path: '/api/gotTowed',
    handler: function (request, reply) {
      DAL.customPages.getByKey('got-towed', function (err, docs) {
        !err ? reply(docs) : reply('Error: ' + err);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/gotTowed',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['customPages:edit']
        }
      },
      handler: function (request, reply) {
        var sendingObject = _.clone(request.payload);
        sendingObject.customJson = JSON.stringify(request.payload.customJson);
        sendingObject.content = sanitizeHtml(sendingObject.content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['span', 'img']),
          allowedAttributes: {
          '*': ['style'],
          'img': ['src']
          }
        });
        DAL.customPages.update(sendingObject, function (err, doc) {
          if (!err && doc) {
            reply(doc);
          } else {
            reply(JSON.stringify(err));
          }
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/parkingProblem',
    handler: function (request, reply) {
      DAL.customPages.getByKey('parking-problem', function (err, docs) {
        !err ? reply(docs) : reply('Error: ' + err);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/parkingProblem',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['customPages:edit']
        }
      },
      handler: function (request, reply) {
        DAL.customPages.update(request.payload, function (err, doc) {
          if (!err && doc) {
            reply(doc);
          } else {
            reply(JSON.stringify(err));
          }
        });
      }
    }
  });
};