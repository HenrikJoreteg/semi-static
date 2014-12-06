var url = require('url'),
    fs = require('fs'),
    _ = require('underscore'),
    path = require('path');

_.str = require('underscore.string');

module.exports = function (conf) {
    var config = conf || {};
    _.defaults(config, {
        folderPath: path.dirname(require.main.filename) + '/views/static',
        fileExt: 'jade',
        root: '',
        keepExt: false
    });
    return function (req, res, next) {
        var pathName = (config.root && req.url.indexOf(config.root) === 0) ? req.url.slice(config.root.length) : req.url,
            fullPath;

        // trim off ? and #
        pathName = pathName.split('?')[0].split('#')[0];

        if (req.url === config.root || req.url === (config.root + '/')) {
            fullPath = config.folderPath + '/index.' + config.fileExt;
        } else {
            fullPath = config.folderPath + pathName;
            if(!config.keepExt) fullPath += '.' + config.fileExt;
	    if(config.keepExt && !_.str.endsWith(fullPath, config.fileExt)) return next();
	  
        }

        fs.exists(fullPath, function (exists) {
            if (exists) {
                res.render(fullPath, {pageName: _.last(req.url.split('/'))});
            } else {
                next();
            }
        });
    };
};
