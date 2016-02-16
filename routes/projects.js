var express = require('express');
var router = express.Router();

// router.use(function timeLog(req,res,next){
//   console.log('Time: ', Date.now());
//   next();
// });

router.get('/', function(req, res, next) {
  res.redirect("/");
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

router.get('/ice', function(req, res) {
  res.render('projects/ice');
});

router.get('/august', function(req, res) {
  var jade = require('jade');
  res.render('projects/show', {title: "August", templateRender: jade.renderFile});
});

router.get('/herringbone', function(req, res) {
  res.render('projects/herringbone');
});

module.exports = router;
