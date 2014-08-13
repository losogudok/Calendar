var fs = require('fs');
var express = require('express');
var router = express.Router();
var path = require('path');
var routes = {};

/* GET home page. */

routes.index = router.get('/', function(req, res) {
    res.render('index');
});

// Get all routes in one dictionary

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
        routes[path.basename(file,'.js')] = require(path.join(__dirname, file));
    });

module.exports = routes;
