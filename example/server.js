// # Super Simple Demo
"use strict";

// We start with express
var express = require("express");

// We require semi-static.
// In your code it'd just be require("semi-static") but we
// reference it relatively to pull the one from this repo
var semiStatic = require("../../semi-static");

// Init our app.
var app = express();

// Serve our static files (css, js, images, etc.)
// semi-static doesn't do this for us.
app.use(express.static(__dirname + "/public"));

// Tell express to use pug
app.set("view engine", "pug");

// If you're using express out of the box, you can just
// do this. And it will assume you put your pug files
// into 'views/static' and will look for an 'index.pug' file.
// You can also pass it a static context object,
// that will get passed to the template engine
app.get("*", semiStatic({
    passReq: true,
    context: {static: true}
}));

// You can optionally configure other semi-static "microsites"
// alongside in any folder you want.
//
// The following will make the templates inside the 'helpsite'
// folder into a semi-static site available at 'example.com/help'.
// It will also call the options.context function with the req and a callback,
// in this case populating baz with an uppercased foo (if it exists);
// but you can perform any calculation so long as you return an object
app.get("/help/*", semiStatic({
    folderPath: __dirname + "/helpsite",
    root: "/help",
    context: function(req, done) {
        console.log(req.query.foo);
        if (req.query.foo) {
            return done(null, {baz: req.query.foo.toUpperCase()});
        }
        done(null, {});
    }
}));

// we can still have a normal 404 at the end
// because it will only do something if there's
// a path that matches.
app.all("*", function (req, res) {
    res.status(404).send("not found");
});

app.listen(3000);
console.log("started");
