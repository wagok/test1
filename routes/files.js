var express = require('express');
var files = require('../controllers/files');
var router = express.Router();

router.all('/*', files.all);

router.get('/*', files.get);

router.post('/*', files.post);

router.put('/*', files.put);

router.delete('/*', files.delete);

module.exports = router;