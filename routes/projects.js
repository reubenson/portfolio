var express = require('express');
var router = express.Router();
var jade = require('jade');

var projects = {
  "birdr": "Birdr",
  "git-r": "Git-R",
  "qcvg": "QCVG",
  "private chronology": "Private Chronology"
}

router.get('/', function(req, res, next) {
  res.redirect('/');
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
