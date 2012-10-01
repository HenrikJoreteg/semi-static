var url = require('url'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore');


module.exports = function (conf) {
    var config = conf || {};
    _.defaults(config, {
        folderPath: path.dirname(module.parent.filename) + '/views/static',
        fileExt: 'jade'
    });
    return function (req, res, next) {
        var parsed = url.parse(req.url),
            fullPath = config.folderPath + parsed.pathname + '.' + config.fileExt;
        
        fs.exists(fullPath, function (exists) {
            if (exists) {
                res.render(fullPath, {pageName: _.last(parsed.pathname.split('/'))});
            } else {
                next();
            }
        });
    };
};