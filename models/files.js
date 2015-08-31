var fs = require('fs');


// Get folder or file
exports.get = function (currentPath, result) {

    fileDir(currentPath,
        // error callBack
        result,
        // file callBack
        function (path) {
            fs.readFile(path, function (err, data) {
                if (err) {
                    return result(err);
                }
                result(data);
            });
        },
        // directory callBack
        function (path) {
            fs.readdir(path, function (err, files) {
                if (err) {
                    return result(err);
                }
                result({path: currentPath, list: files});
            });
        }
    );
}

// Post file content (must exists)
exports.post = function (currentPath, data, result) {
    // Check is path ends with '/'
    if (currentPath.indexOf('/', currentPath.length - 1) !== -1) {
        result({message: path + ' is look like a directory'});
    } else {
        // fs.exists() will be deprecated.
        // Just open the file and handle the error when it's not there.
        fs.open(currentPath, 'w', function (err, fd) {
            if (err) {
                result({message: "File is not exist"});
            } else {
                // Do we have to close fileDesc (fd) here or not?
                fs.writeFile(currentPath, data, function (err) {
                    if (err) {
                        return result(err);
                    }
                    result({message: "OK"});
                });
            }
        });
    }
}

// Put file or folder (must not exist)
exports.put = function (currentPath, data, result) {
    if (currentPath.indexOf('/', currentPath.length - 1) !== -1) {
        // Directory end with /
        fs.mkdir(currentPath, function (err) {
            if (err) {
                return result(err);
            }
            result({message: 'OK'});
        });
    } else {
        // It's file
        fs.open(currentPath, 'r', function (err, fd) {
            if (err) {
                fs.writeFile(currentPath, data, function (err) {
                    if (err) {
                        return result(err);
                    }
                    result({message: 'OK'});
                });
            } else {
                result({message: "File or directory already exists"});
            }
        });
    }
}

// Delete folder or file must exist, folder must be empty
exports.delete = function (currentPath, result) {
    fileDir(currentPath,
        // error callBack
        function (err) {
            return result(err);
        },
        // file callBack
        function (path) {
            fs.unlink(path, function (err) {
                if (err) {
                    return result(err);
                }
                result({message: 'OK'});
            });
        },
        // directory callBack
        function (path) {
            fs.rmdir(path, function (err) {
                if (err) {
                    return result(err);
                }
                result({message: 'OK'});
            });
        }
    );
}
// util function
function fileDir(path, error, isFile, isDir) {
    fs.stat(path, function (err, stats) {
        if (err) {
            return error(err);
        }
        if (stats.isDirectory() == true) {
            isDir(path);
        } else if (stats.isFile() == true) {
            isFile(path);
        }
    });
}
