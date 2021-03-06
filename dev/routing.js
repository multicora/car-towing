// TODO: separate static url frpm API

'use strict';

const path = require('path');
const DAL = require('./dal/dal.js');
const Utils = require('./services/utils.js');

module.exports.init = server => {
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
  require('./routing/roles.js')(server);
  require('./routing/decal.js')(server);
  require('./routing/contracts.js')(server);
  require('./routing/towing.js')(server);

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
      handler: (request, reply) => {
        // TODO: move to separate function
        // visitor counter functionality
        if (!request.state.session && request.raw.req.url.endsWith('.html')) {
          // TODO: replace with redis solution
          DAL.settings.getByName('visitorsCounter', (err, docs) => {
            if (!err) {
              const visitorCount = docs && (+docs.value) || 0;
              DAL.settings.update({name: 'visitorsCounter', value: visitorCount + 1}, (err, docs) => {});
            }
          });
          const session = { Token: Utils.newToken() };
          reply.file(path.resolve(__dirname, './public/' + (request.params.param || 'index.html'))).state('session', session);
        } else {
          reply.file(path.resolve(__dirname, './public/' + (request.params.param || 'index.html')));
        }
      }
    }
  });
};
