'use strict';

const Hapi = require('hapi');
const path = require('path');
const Good = require('good');
const mongoose = require('mongoose');

const server = new Hapi.Server();
server.connection({ port: 3000 });



// server.start((err) => {

//   if (err) {
//       throw err;
//   }
//   console.log('Server running at:', server.info.uri);
// });

server.register(require('inert'), (err) => {

  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file( path.resolve(__dirname, './public/index.html') );
    }
  });
  // server.route({
  //   method: 'GET',
  //   path: '/hello',
  //   handler: function (request, reply) {
  //     reply.file('./public/hello.html');
  //   }
  // });
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
});

server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, (err) => {

  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start((err) => {

    if (err) {
      throw err;
    }
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});