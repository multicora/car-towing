const permissionsFunc = function(credentials, callback) {
  // let userPermissions = {};

  const roles = credentials.roles.map( (role) => {
    return role.name;
  } );

  const hasRole = (name) => {
    return roles.indexOf(name) >= 0;
  };

  var userPermissions = {
    blocking: {
      read: hasRole('driver') || hasRole('admin') || hasRole('property-manager'),
      create: hasRole('admin') || hasRole('property-manager'),
      edit: hasRole('admin') || hasRole('property-manager')
    },
    customPages: {
      edit: hasRole('admin')
    },
    contracts: {
      read: hasRole('admin') || hasRole('property-manager'),
      edit: hasRole('admin'),
      delete: hasRole('admin')
    },
    decal: {
      edit: hasRole('admin') || hasRole('property-manager'),
      create: hasRole('admin') || hasRole('property-manager'),
      remove: hasRole('admin') || hasRole('property-manager')
    },
    files: {
      read: hasRole('driver') || hasRole('admin') || hasRole('property-manager'),
      create: hasRole('driver') || hasRole('admin') || hasRole('property-manager')
    },
    parkingRules: {
      create: hasRole('admin') || hasRole('property-manager'),
      edit: hasRole('admin') || hasRole('property-manager'),
      delete: hasRole('admin') || hasRole('property-manager'),
    },
    properties: {
      create: hasRole('admin') || hasRole('property-manager'),
      edit: hasRole('admin') || hasRole('property-manager'),
      delete: hasRole('admin') || hasRole('property-manager')
    },
    users: {
      delete: hasRole('admin'),
      create: hasRole('admin'),
      write: hasRole('admin'),
      read: hasRole('admin') || hasRole('property-manager'),
    },
    locations: {
      read: hasRole('driver') || hasRole('admin') || hasRole('property-manager'),
      create: hasRole('admin'),
      delete: hasRole('admin')
    },
    towing: {
      read: hasRole('driver') || hasRole('admin') || hasRole('property-manager'),
      create: hasRole('driver') || hasRole('admin'),
      delete: hasRole('admin')
    }
  };

  callback(null, userPermissions);
};

module.exports = function (server, cb) {
  server.register(
    {
      register: require('hapi-route-acl'),
      options: {
        permissionsFunc: permissionsFunc
      }
    },
    cb
  );
};