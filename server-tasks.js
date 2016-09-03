const tasks = require('./server-run/tasks.js');
const express = require('express');
const app = express();

const port = 8081;

app.get(/\/deploy\/(.*)/, function (req, res) {
  console.log(req.params[0]);
  tasks.gitCheckout(
    req.params[0],
    function(data){
      res.send(data);
    }
  );
});

app.listen(port, function () {
  console.log('CART task runer app listening on port ' + port + '!');
});