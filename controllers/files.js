var config = require('../config');
var filesModel = require('../models/files');
var js2xmlparser = require('js2xmlparser');
var currentPath = '';
var render = "";

// Common filter
exports.all = function (req, res, next) {
    // Filter `..` in path
    if (/(\/|^)\.\.(\/|$)/i.test(req.params[0])) {
        return res.send({error: '\'..\' in path is unacceptable'})
    }
    currentPath = req.params[0]==='' ? '.' : req.params[0];
    currentPath = config.filesPath.path + currentPath;

    if (req.param('xml')) {
        render = (function(o) {
            js2xmlparser('xml', o, {
                arrayMap: {
                    list: "item"
                }});
        });
    } else {
        render = JSON.stringify;
    }
    next();
}

// Get folder or file
exports.get = function (req, res) {
    filesModel.get(currentPath, res.send);
}

// Post file content (must exists)
exports.post = function (req, res) {
    filesModel.post(currentPath, res.send);
}

// Put file or folder (must not exist)
exports.put = function (req, res) {
    filesModel.post(currentPath, res.send);
}

// Delete folder or file must exist, folder must be empty
exports.delete = function (req, res) {
    filesModel.delete(currentPath, res.send);
}
