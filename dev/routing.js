// TODO: separate static url frpm API

'use strict';

const path = require('path');
const DAL = require('./dal/dal.js');
const Joi = require('joi');
const Boom = require('boom');

module.exports.init = function (server) {

  require('./routing/files.js')(server);
  require('./routing/blocking.js')(server);
  require('./routing/parkingRules.js')(server);
  require('./routing/auth.js')(server);
  require('./routing/property.js')(server);
  require('./routing/users.js')(server);
  require('./routing/customPage.js')(server);

  // For debugging
  //require('./routing/roles.js')(server);

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, './public')
      }
    }
  });

};