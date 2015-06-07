var router = require('express').Router();
var AV = require('leanengine');
var moment = require('moment');

var Activity = AV.Object.extend('Activity');

router.get('/', function(req, res, next) {
    var query = new AV.Query(Activity);
    query.descending('createdAt');
    query.find({
        success: function(results) {
            res.render('createActivity', {
                title: 'Create Activity',
                activities: results
            });
        },
        error: function(err) {
                next(err);
        }
    });
});

router.post('/', function(req, res, next) {
    var eventDateInput = moment(req.body.eventDate).format();
    var eventDate = new Date(eventDateInput);
    var activity = new Activity();
    activity.set('title', req.body.title);
    activity.set('eventDate', eventDate);
    activity.set('content', req.body.content);
    activity.set('location', req.body.location);
    activity.set('tags', req.body.tags);
    activity.save(null, {
        success: function(activity) {
            res.redirect('/activities');
        },
        error: function(err) {
            err += testDate;
            next(err);
        }
    })
})

module.exports = router;
