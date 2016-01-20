var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Portfolio' });
// });

router.get('/', function(req, res, next) {
  var jade = require('jade');
  res.render('projects/index', {
    title: "Projects",
    projects: ["Birdr" , "Git-R" , "QCVG", "Private Chronology"],
    templateRender: jade.renderFile
  });
});

router.get('/birdr', function(req, res, next) {
  var jade = require('jade');
  res.render('projects/show', {title: "Birdr", templateRender: jade.renderFile});
});

router.get('/Git-R', function(req, res, next) {
  var jade = require('jade');
  res.render('projects/show', {title: "Git-R", templateRender: jade.renderFile});
});

router.get('/qcvg', function(req, res, next) {
  var jade = require('jade');
  res.render('projects/show', {title: "QCVG", templateRender: jade.renderFile});
});

router.get('/private-chronology', function(req, res, next) {
  var jade = require('jade');
  res.render('projects/show', {title: "Private Chronology", templateRender: jade.renderFile});
});



module.exports = router;
