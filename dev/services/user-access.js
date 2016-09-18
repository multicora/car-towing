module.exports = {
  hasAccess: function (userRoles, accessRoles) {
    let findRole = false;

    userRoles.forEach(function (useRole) {
      accessRoles.forEach(function (accessRole) {
        if (accessRole === useRole) {
          findRole = true;
        }
      });
    });

    return findRole;
  }
};