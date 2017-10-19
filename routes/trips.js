const
    express = require('express'),
    passport = require('passport'),
    tripsRouter = new express.Router(),
    Trip = require('../models/Trip.js'),
    Activity = require('../models/Activity.js'),
    tripsController = require('../controllers/trips.js')



tripsRouter.get('/', tripsController.index)
tripsRouter.get('/:id', tripsController.show)
tripsRouter.patch('/:id', tripsController.update)



    tripsRouter.route('/:id')



    .delete((req, res) => {
        Trip.findByIdAndRemove(req.params.id, (err, deletedTrip) => {
            res.redirect('/users/profile')
        })
    })
    

    tripsRouter.route('/:id/activity')
    .get((req, res) => {
        Trip.findById(req.params.id, (err, trip) => {
            //res.json(trip)
            res.render('../views/trips/trip', {trip:trip})
        })
    })
    .post((req, res) => {
        var newActivity = new Activity(req.body)
        newActivity.trip = req.params.id
        newActivity.user = req.user
        newActivity.save((err, activity) => {
            console.log(req.params.id)
            res.redirect(`/trips/${req.params.id}`)
            //res.json({success: true, message: "Activity created!", activity})
        })
    })

    .patch((req, res) => {
        Activity.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedActivity) => {
            res.json(updatedActivity)
        })
    })

    .delete((req, res) => {
        Activity.findByIdAndRemove(req.params.id, (err, deletedActivity) => {
            res.json({success: true, message: `${deletedActivity.place} has been deleted.`})
        })
    })

tripsRouter.get('/:tripId/activities/:activityId', (req, res) => {
    Activity.findById(req.params.activityId, (err, activity) => {
        res.json(activity)
    })
}) 

tripsRouter.route('/:id/edit')
.get((req, res) => {
    Trip.findById(req.params.id, (err, trip) => {
        if(err) return console.log(err)
        res.render('../views/trips/edit', {trip:trip})
    })
})
    
module.exports = tripsRouter