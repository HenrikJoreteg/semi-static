var url = require('url'),
    fs = require('fs'),
    _ = require('underscore'),
    path = require('path');


module.exports = function (conf) {
    var config = conf || {};
    _.defaults(config, {
        folderPath: path.dirname(require.main.filename) + '/views/static',
        fileExt: 'jade',
        root: '',
        passReq: false,
        context: null
    });
    function clean(url) {
        return url.split('?')[0].split('#')[0];
    }
    return function (req, res, next) {
        var pathName = (config.root && req.url.indexOf(config.root) === 0) ? req.url.slice(config.root.length) : req.url,
            fullPath;

        // trim off ? and #
        pathName = clean(pathName);
        var reqUrl = clean(req.url);

        if (reqUrl === config.root || reqUrl === (config.root + '/')) {
            fullPath = config.folderPath + '/index.' + config.fileExt;
        } else {
            fullPath = config.folderPath + pathName + '.' + config.fileExt;
        }

        fs.exists(fullPath, function (exists) {
            if (exists && !config.context) {
                res.render(fullPath, {
                    pageName: _.last(reqUrl.split('/')),
                    req: config.passReq ? req : null
                });
            } else if (exists && typeof config.context === "function") {
                config.context(req, function(err, context){
                    if (err) return next(err);
                    console.log(context);
                    if (config.passReq) context.req = req;
                    res.render(fullPath, context);
                });
            } else if (exists && config.context) {
                if (config.passReq) config.context.req = req;
                res.render(fullPath, config.context);
            } else {
                next();
            }
        });
    };
};
