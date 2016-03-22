"use strict";

var fs = require("fs");
var path = require("path");

function defaults(config) {
    var ret = {};

    if (config.folderPath != null) {
        ret.folderPath = config.folderPath;
    } else {
        ret.folderPath = path.dirname(require.main.filename) + "/views/static";
    }

    ret.fileExt = config.fileExt != null ? config.fileExt : "jade";
    ret.root = config.root != null ? config.root : "/";
    ret.passReq = !!config.passReq;
    ret.context = config.context;
    return ret;
}

module.exports = function (config) {
    if (config == null) {
        config = {};
    } else if (typeof config !== "object") {
        config = {folderPath: config + ""};
    } else {
        config = defaults(config);
    }

    function clean(url) {
        return url.split('?')[0].split('#')[0];
    }

    return function (req, res, next) {
        var url;

        if (config.root && req.url.indexOf(config.root) === 0) {
            url = req.url.slice(config.root.length);
        } else {
            url = req.url;
        }

        // trim off ? and #
        url = clean(url);

        var reqUrl = clean(req.url);

        var file;

        if (reqUrl === config.root || reqUrl === (config.root + "/")) {
            file = config.folderPath + "/index." + config.fileExt;
        } else {
            file = config.folderPath + "/" + url + "." + config.fileExt;
        }

        fs.exists(file, function (exists) {
            if (exists && !config.context) {
                res.render(file, {
                    pageName: path.basename(reqUrl),
                    req: config.passReq ? req : null
                });
            } else if (exists && typeof config.context === "function") {
                config.context(req, function (err, context) {
                    if (err) return next(err);
                    if (config.passReq) context.req = req;
                    res.render(file, context);
                });
            } else if (exists && config.context) {
                if (config.passReq) config.context.req = req;
                res.render(file, config.context);
            } else {
                next();
            }
        });
    };
};
