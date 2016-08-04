'use strict';

const path = require('path');
const DAL = require('./dal/dal.js');

module.exports.init = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/index.html') );
    }
  });
  server.route({
    method: 'GET',
    path: '/1',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/1.png') );
    }
  });
  server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
      reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
  });
  server.route({
    method: 'GET',
    path: '/test',
    handler: function (request, reply) {
      DAL.properties.get(function (err, docs) {
        reply('Docs: ' + JSON.stringify(docs));
      });
    }
  });
  server.route({
    method: 'GET',
    path: '/testcreate',
    handler: function (request, reply) {
      DAL.properties.create({name: 'testName'}, function (err, docs) {
        !err ? reply('Done') : reply('Error:');
      });
    }
  });
};