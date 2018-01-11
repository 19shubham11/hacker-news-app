var express = require('express');
var app = express();
var routes = require('./routes.js');

app.use('/',routes);


app.listen(3000);
console.log('Server running on port 3000');