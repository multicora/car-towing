const tasks = require('./server-run/tasks.js');
const express = require('express');
const app = express();

const port = 8081;

app.get(/\/deploy\/(.*)/, function (req, res) {
  tasks.gitPull().then(
    function () {
      return tasks.gitCheckout(req.params[0]);
    },
    function (res) {
      res.send(res);
    }
  ).then(
    function (res) {
      return tasks.gitPull();
    },
    function (res) {
      res.send(res);
    }
  ).then(
    function (res) {
      return tasks.gulpBuild();
    },
    function (res) {
      res.send(res);
    }
  ).then(
    function (res) {
      return tasks.restart();
    },
    function (res) {
      res.send(res);
    }
  ).then(
    function (res) {
      res.send(res);
    },
    function (res) {
      res.send(res);
    }
  );
});

app.listen(port, function () {
  console.log('CART task runer app listening on port ' + port + '!');
});