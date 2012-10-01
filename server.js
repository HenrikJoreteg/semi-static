// super simple demo
var express = require('express'),
    semiStatic = require('./semi-static');

// init our app
app = express();

// use jade
app.set('view engine', 'jade');

// register our handler
app.get('*', semiStatic());

// we can still have a normal 404 at the end
// because it will only do something if there's
// a path that matches.
app.all('*', function (req, res) {
    res.send('not found', 404);
});

app.listen(3000);
console.log('started');