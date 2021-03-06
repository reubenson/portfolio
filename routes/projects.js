var express = require('express');
var router = express.Router();
var jade = require('jade');

var projects = {
  "birdr": "Birdr",
  "qcvg": "QCVG",
  "private-chronology": "Private Chronology",
  "about": "About",
  "selected-discography": "Selected Discography"
}

router.get('/', function(req, res, next) {
  res.render('projects/index', {
    title: "Reuben Son - Projects",
    templateRender: jade.renderFile
  });
});

router.get('/ice', function(req, res) {
  res.redirect('/ice');
});

router.get('/herringbone', function(req, res) {
  res.redirect('/herringbone')
});

router.get('/:name', function(req,res){
  var name = req.params.name.toLowerCase();
  var project = projects[name];
  if (project) {
    res.render('projects/show', {title: project, templateRender: jade.renderFile});
  } else {
    res.redirect('/');
  }
})

module.exports = router;
