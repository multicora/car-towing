(function (window) {
  console.log('=-=');

  window.sqlitePlugin = {
    openDatabase: function () {
      console.log('openDatabase mock');
      console.log(arguments);

      return db();
    }
  };

  function db() {
    return {
      transaction: function (f) {
        console.log('transaction mock');
        console.log(arguments);
        f( transaction() );
      }
    }
  }

  function transaction() {
    return {
      executeSql: function (sql,p2,f) {
        console.log('executeSql mock');
        console.log(arguments);
        f(null, getResponse(sql) );
      }
    }
  }

  function getResponse(sql) {
    var data = [
      {
        exp: new RegExp('select value from settings where name = "version"'),
        data: {
          rows: {
            item: function () {
              return {
                value: 0
              }
            }
          }
        }
      },
      {
        exp: new RegExp('select \\* from photos'),
        data: {
          rows: {
            item: function () {
              return {}
            }
          }
        }
      }
    ];

    var result = data.find(function (item) {
      return item.exp.test(sql);
    });

    return result && result.data;
  }
})(window);