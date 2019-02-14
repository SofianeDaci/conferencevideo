var express = require('express');
var conference = require('../controller/conference');
const router = express.Router()

router.route('/')
    .get(conference.get)
    .post(conference.add);

exports.default = router;
module.exports = exports['default'];