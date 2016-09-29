// TODO: separate static url frpm API

'use strict';

const path = require('path');
const DAL = require('./dal/dal.js');
const Joi = require('joi');
const Boom = require('boom');
const Utils = require('./services/utils.js');

module.exports.init = function (server) {

  require('./routing/files.js')(server);
  require('./routing/blocking.js')(server);
  require('./routing/parkingRules.js')(server);
  require('./routing/auth.js')(server);
  require('./routing/property.js')(server);
  require('./routing/users.js')(server);
  require('./routing/customPage.js')(server);
  require('./routing/locations.js')(server);
  require('./routing/settings.js')(server);
  require('./routing/complaint.js')(server);

  // For debugging
  //require('./routing/roles.js')(server);

  server.route({
    method: 'GET',
    path: '/{param*}',
    config: {
      state: {
        parse: true,
        failAction: 'log'
      },
      handler:  function (request, reply) {
        // TODO: move to separate function
        // visitor counter functionality
        let newToken = Utils.newToken();
        if (!request.state.session && request.raw.req.url.endsWith('.html')) {
          // TODO: replace with redis solution
          DAL.settings.getByName('visitorsCounter', (err, docs) => {
            if (!err) {
              let visitorCount = docs && (+docs.value) || 0;
              DAL.settings.update({name: 'visitorsCounter', value: visitorCount+1}, (err, docs) => {});
            }
          });
          let session = { Token: Utils.newToken() };
          reply.file( path.resolve(__dirname, './public/' + (request.params.param || 'index.html') ) ).state('session', session);
        } else {
          reply.file( path.resolve(__dirname, './public/' + (request.params.param || 'index.html') ) );
        }
      }
    }
  });
};