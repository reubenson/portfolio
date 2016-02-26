var express = require('express');
var router = express.Router();
var jade = require('jade');

router.get('/', function(req, res, next) {
  res.render('projects/index', {
    title: "Reuben Son - Projects",
    projects: ["Birdr" , "Git-R" , "QCVG", "Private Chronology"],
    templateRender: jade.renderFile
  });
});

router.get('/ice', function(req, res) {
  res.render('projects/ice');
});

router.get('/august', function(req, res) {
  res.render('projects/august');
});

router.get('/herringbone', function(req, res) {
  res.render('projects/herringbone');
});

module.exports = router;
