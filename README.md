# semi-static

Simple, lazy way to serve a directory of semi-static pages in express.js. Handy for building quick "static" pages inside an otherwise "dynamic" app.

Often you have a dynamic web app that also needs a bunch of mostly "static" pages. But you still want to use the same app layouts and template system to build out those pages. Take for instance an FAQ page inside your app that otherwise has a bunch of dynamic content. 

It's silly to build a specifc route for that page when all you really want is a route that at 'http://yourapp.com/faq' renders the `faq.jade` template in your [express.js](http://expressjs.com/) app.

I find myself adding code like this to nearly every express app I write, so I figured why the heck not publish an npm module and re-use that. So, here we are.


## How to use it

You can just `node server.js` and both http://localhost:3000/test and http://localhost:3000/nested/nested-works-too should render the correct templates.

Here's the code:

```
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
```


## Install

`npm install semi-static`


## Options / How it works

All it needs is the folder where your "static" templates live and the file extension your templates use.

Defaults are `jade` as a file extension and `__dirnam + '/views/static'` as the directory.

If that's not the case you can set the options as follows:

```
app.get('*', semiStatic({
    folderPath: '/my-other-folder',
    fileExt: 'ejs'
}));
```

That's it, easy-peasy.

## License

MIT


If you think this is handy. Follow [@HenrikJoreteg](https://twitter.com/henrikjoreteg) on the twitters. See you on the interwebz!