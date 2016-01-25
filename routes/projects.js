var express = require('express');
var router = express.Router();

// router.use(function timeLog(req,res,next){
//   console.log('Time: ', Date.now());
//   next();
// });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('projects/index', {
    title: "Reuben Son - Projects",
    projects: ["Birdr" , "Git-R" , "QCVG" , "Private Chronology"]
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

router.get('/ice', function(req, res) {
  res.render('projects/ice');
});

module.exports = router;
