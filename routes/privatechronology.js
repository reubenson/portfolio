var express = require('express');
var router = express.Router();
var jade = require('jade');

var catalogue = {
  "07": "Asleep at the Drawing Board",
  "git-r": "Git-R",
  "qcvg": "QCVG",
  "private-chronology": "Private Chronology"
}

router.get('/', function(req, res, next) {
  res.render('projects/index', {
    title: "Reuben Son - Projects",
    templateRender: jade.renderFile
  });
});

router.get('/:name', function(req,res){
  var name = req.params.name.toLowerCase();
  var project = catalogue[name];
  if (project) {
    // res.render('privatechronology/show', {title: name, templateRender: jade.renderFile});
    res.render('/privatechronology/07.html');
    // console.log(project);
    // res.render('privatechronology/' + name);
    // res.render('projects/show', {title: project, templateRender: jade.renderFile});
  } else {
    console.log('test')
    res.redirect('/');
  }
})

module.exports = router;
