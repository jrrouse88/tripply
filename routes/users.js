const
    express = require('express'),
    passport = require('passport'),
    usersRouter = new express.Router(),
    User = require('../models/User.js'),
    Trip = require('../models/Trip.js')
    
usersRouter.route('/')
    .get((req, res) => {
        User.find({}, (err, users) => {
            //res.json(trips)
            res.json(users)
        })
    })

usersRouter.route('/login')
    .get((req, res) => {
        res.render('login', {message: req.flash('loginMessage')})
    })
    .post(passport.authenticate('local-login', {
        successRedirect: '/users/profile',
        failureRedirect: '/users/login'
    }))

usersRouter.route('/signup')
    .get((req, res) => {
        res.render('signup', {message: req.flash('signupMessage')})
    })

    .post(passport.authenticate('local-signup', {
        successRedirect: '/users/profile',
        failureRedirect: '/users/signup'
    }))

//var userId
usersRouter.route('/profile') 
.get(isLoggedIn, (req, res) => {
    Trip.find({user: req.user._id}, (err, trips) => {
        var sortedTrips = trips.sort(function(a, b) {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime() 
        })
        res.render('profile', {user: req.user, trips:sortedTrips})
        //userId = req.user._id
    })
    //userId = req.user._id
    //console.log(userId)
})
    
    .patch(isLoggedIn, (req, res) => {
        // console.log(req.body)
        
        User.findByIdAndUpdate(req.user._id, req.body, {new:true}, (err, updatedUser) => {
            res.redirect('/users/profile')
         })
    })

    .post(isLoggedIn, (req, res) => { // need to add isLoggedIn when we can test with a form rather than Postman
        newTrip = new Trip(req.body)
        newTrip.user = req.user._id
        console.log(newTrip)
        newTrip.save((err, trip) => {
            res.redirect(`/trips/${trip._id}`)
        })
    })

    .delete(isLoggedIn, (req, res) => {
        console.log(req.user)
        User.findByIdAndRemove(req.user._id, (err, user) => {
            if (err) return console.log(err)
            req.logout()
            res.redirect('/')
        })
    })

usersRouter.route('/profile/edit')
    .get(isLoggedIn, (req, res) => {
        User.findById(req.user._id, (err, user) => {
            if(err) return console.log(err)
            console.log(req.user)
            res.render('../views/users/edit', {user:user})
        })
    })

usersRouter.get('/logout', (req, res) => {
    // destroy the session, redirect back home
    req.logout()
    res.redirect('/')
})

function isLoggedIn(req, res, next) {
if(req.isAuthenticated()) return next()
res.redirect('/')
}

usersRouter.route('/:id')
    .patch((req, res) => {
        User.findById(req.params.id, (err, user) => {
            if(err) return console.log(err)
            user = Object.assign(user, req.body)
            user.save((err, updatedUser) => {
                if(err) return console.log(err)
                res.json({
                    success: true,
                    message: 'User Updated',
                    user: updatedUser 
             })
        })

    })
})
module.exports = usersRouter