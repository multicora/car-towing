(function () {
  'use strict';
  angular
    .module('DatabaseModule', [])
    .service('DatabaseService', DatabaseService);

  DatabaseService.$inject = ['$q', '$cordovaSQLite', '$ionicPlatform'];

  function DatabaseService($q, $cordovaSQLite, $ionicPlatform) {
    var db;

    return {
      updateImage: updateImage,
      getImages: getImages,
      deleteImage: deleteImage,
      getAll: getAll,
      addImage: addImage
    };

    function dbReady() {
      var deferred = $q.defer();
      $ionicPlatform.ready(function () {
        if (!db) {
          if (window.sqlitePlugin !== undefined) {
            db = window.sqlitePlugin.openDatabase({name: "car-towing.db", location: 2, createFromLocation: 1},
              function (data) {
                console.log('Success. DB ready');
                deferred.resolve();
              }, function (err) {
                console.log('Error. DB ready');
                deferred.reject();
              });
          } else {
            // For debugging in the browser
            db = window.openDatabase("car-towing.db", "1.0", "Database", 200000);
            createDB()
              .then(function(r) {
                console.log(r);
                deferred.resolve();
              }, function(e) {
                deferred.reject();
              });
          }
        } else {
          deferred.resolve()
        }
      }.bind(this));

      return deferred.promise;
    }

    function createDB() {
      alert('DB start creating');
      return new Promise(function(resolve, reject) {
        var query = "CREATE TABLE IF NOT EXISTS images (id integer primary key, name text, imgBase64 text, date text sent boolean default false, deleted boolean default false)";
        _execute(query, [],
          function (data) {
            console.log(data);
            resolve(data);
          }, function (error) {
            console.error(error);
            reject(error);
          });
      });
    }


    function addImage(image, success, error) {
      var query = "INSERT INTO images (name, imgBase64, date,  sent, deleted) VALUES (?, ?, ?, ?, ?)";

      _execute(query, [image.name, image.imgBase64, image.date, image.sent || false, image.deleted || false],
        function (res) {
          success(res);
        }, function (err) {
          error(err);
        });
    }

    function updateImage(image, success, error) {
      var query = "UPDATE images SET name=?, imgBase64=?, date=?, sent=?, deleted=? WHERE id=?";

      _execute(query, [image.name, image.imgBase64, Date.now(), image.sent, image.deleted],
        function (res) {
          success(res);
        }, function (err) {
          error(err);
        });
    }

    function getImages(searchQuery, limit, offset, success, error) {
      var searchQuery = (searchQuery) ? " AND text LIKE '%" + searchQuery + "%'" : "",
        query = "SELECT * FROM images WHERE deleted = false " + searchQuery + " ORDER BY date DESC LIMIT ? OFFSET ? ";

      _execute(query, [limit, offset],
        function (res) {
          var images = [];

          for (var i = 0; i < res.rows.length; i++) {
            var item = res.rows.item(i);
            item.date = new Date(item.date);
            images.push(item);
          }
          success(images);
        }, function (err) {
          error(err);
        });
    }

    function deleteImage(image, success, error) {
      var query = "DELETE FROM images where id=?";

      _execute(query, [image.id],
        function (res) {
          success(res);
        }, function (err) {
          error(err);
        });
    }

    function getAll(success, error) {
      var query = "SELECT * FROM images";

      _execute(query, [],
        function (res) {
          success(res);
        }, function (err) {
          error(err);
        });
    }

    function _execute(query, params, success, error) {
      dbReady()
        .then(function () {
        $cordovaSQLite.execute(db, query, params).then(
          function (data) {
            console.log(JSON.stringify(data));
            if (angular.isFunction(success))
              success(data);
          }, function (err) {
            console.log(JSON.stringify(err));
            if (angular.isFunction(error))
              error(err);
          });
      });
    }
  };
}());
