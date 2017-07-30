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

    ret.defaultExt = config.fileExt == null;
    ret.fileExt = config.fileExt != null ? config.fileExt : "pug";
    ret.root = config.root != null ? config.root : "/";
    ret.passReq = !!config.passReq;
    ret.context = config.context;
    return ret;
}

function clean(url) {
    return url.split("?")[0].split("#")[0];
}

function checkExists(config, file, callback) {
    fs.access(file, fs.constants.R_OK, function (err) {
        if (err != null) {
            callback(null, file);
        } else if (config.defaultExt && err.code === "ENOENT" &&
                file.slice(-5) === ".pug") {
            fs.access(file.slice(0, -5) + ".jade", fs.constants.R_OK,
                function (err) {
                    if (err != null) callback(err);
                    else callback(null, file);
                });
        } else {
            callback(err);
        }
    });
}

module.exports = function (config) {
    if (config == null) {
        config = {};
    } else if (typeof config !== "object") {
        config = {folderPath: config + ""};
    } else {
        config = defaults(config);
    }

    return function (req, res, next) {
        // trim off ? and #
        var reqUrl = clean(req.url);
        var file, url;

        if (config.root && req.url.indexOf(config.root) === 0) {
            url = reqUrl.slice(config.root.length);
        } else {
            url = reqUrl;
        }

        if (reqUrl === config.root || reqUrl === (config.root + "/")) {
            file = config.folderPath + "/index." + config.fileExt;
        } else {
            file = config.folderPath + "/" + url + "." + config.fileExt;
        }

        checkExists(config, file, function (err, file) {
            if (err != null) {
                next(err);
            } else if (!config.context) {
                res.render(file, {
                    pageName: path.basename(reqUrl),
                    req: config.passReq ? req : null
                });
            } else if (typeof config.context === "function") {
                config.context(req, function (err, context) {
                    if (err) return next(err);
                    if (config.passReq) context.req = req;
                    res.render(file, context);
                });
            } else {
                if (config.passReq) config.context.req = req;
                res.render(file, config.context);
            }
        });
    };
};
