var router = require('express').Router();
var AV = require('leanengine');

router.get('/activities', function(req, res, next) {
      res.render('createActivity', {
        title: 'Create Activity'
      });
});

module.exports = router;
