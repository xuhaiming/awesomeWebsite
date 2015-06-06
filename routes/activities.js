var router = require('express').Router();
var AV = require('leanengine');
var moment = require('moment');

var Activity = AV.Object.extend('Activity');

router.get('/', function(req, res, next) {
    var day = moment("1995-11-25").format();
    var formattedDate = moment(day, 'MMMM Do YYYY');
    var query = new AV.Query(Activity);
    query.descending('createdAt');
    query.find({
        success: function(results) {
            res.render('createActivity', {
                title: 'Create Activity',
                activities: results,
                time: day
            });
        },
        error: function(err) {
            if (err.code === 101) {
                // ????????{ code: 101, message: 'Class or object doesn\'t exists.' }??? Todo ?????????????? Todo ???
                // ??????????https://leancloud.cn/docs/error_code.html
                res.render('todos', {
                    title: 'TODO ??',
                    todos: []
                });
            } else {
                next(err);
            }
        }
    });
});

router.post('/', function(req, res, next) {
    //var content = req.body.content;
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
