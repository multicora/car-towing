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
    path: '/dummy',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/dummy.html') );
    }
  });
  server.route({
    method: 'GET',
    path: '/{fileName}',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/' + encodeURIComponent(request.params.fileName)) );
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
    path: '/name-{name}',
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
  server.route({
    method: 'GET',
    path: '/api/test',
    handler: function (request, reply) {
      reply('Test api ready!');
    }
  });
};