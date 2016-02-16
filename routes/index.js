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

module.exports = router;
