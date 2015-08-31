var config = require('../config');
var filesModel = require('../models/files');
var js2xmlparser = require('js2xmlparser');
var currentPath = '';
var render = "";

// Common filter
exports.all = function (req, res, next) {

    if (req.accepts('xml')) {
        render = (function(o) {
            if (typeof o == 'object') {
                res.send(js2xmlparser('xml', o, {
                    arrayMap: {
                        list: "item"
                    }}));
            } else {
                res.write(o);
                res.end();
            }

        });
    } else {
        render = (function(o) {
            if (typeof o == 'object') {
                res.send(JSON.stringify(o));
            } else {
                res.write(o);
                res.end();
            }

        });
    }

    // Filter `..` in path
    if (/(\/|^)\.\.(\/|$)/i.test(req.params[0])) {
        return render({error: '\'..\' in path is unacceptable'})
    }
    currentPath = req.params[0]==='' ? '.' : req.params[0];
    currentPath = config.filesPath.path + currentPath;
    next();
}

// Get folder or file
exports.get = function (req, res) {
    filesModel.get(currentPath, render);
}

// Post file content (must exists)
exports.post = function (req, res) {
    filesModel.post(currentPath, req.body, render);
}

// Put file or folder (must not exist)
exports.put = function (req, res) {
    filesModel.put(currentPath, req.body, render);
}

// Delete folder or file must exist, folder must be empty
exports.delete = function (req, res) {
    filesModel.delete(currentPath, render);
}
