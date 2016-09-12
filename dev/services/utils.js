'use strict';

const RandToken = require('rand-token');
const Roles = {
  propertyManager: 'property-manager'
}

module.exports = {
  newToken: function() {
    return RandToken.generate(16);
  },
  rolesNames: Roles
}