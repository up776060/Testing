var express = require('express');
var app = express();
var path = require('path');

//app.use('/api', require('./api'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/test.html'));
});

app.get('/try', function(req, res) {
    res.sendFile(path.join(__dirname + '/try.html'));
});

app.use(express.static('public'));

app.listen(8080);