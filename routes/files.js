var express = require('express');
var router = express.Router();
var files = require('../controllers/files');


router.all('/*', files.all);

router.get('/*', files.get);

router.post('/*', files.post);

router.put('/*', files.put);

router.delete('/*', files.delete);

module.exports = router;