var express = require('express'),
    path = require('path'),
    http = require('http');
var fs = require('fs');
var join = path.join;

var app = express();

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'client')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('App listening on port ' + port);
});

