const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
const userData = require('../models/UserData');
const app = require('../server')

router.get('/', (req, res, next) => {
    res.render('login', {
        title: 'Prijava',
        user: req.session.user,
        linkActive: 'login',
        err: undefined
    });
});

//postupak prijave korisnika
router.post('/', async (req, res, next) => {
    //check if already logged in
    if (req.session.user !== undefined) {
        res.render('login', {
            title: 'Prijava',
            user: req.session.user,
            linkActive: 'login',
            err: 'Molimo Vas da se prvotno odjavite.'
        });
        return;
    }

    let user = await User.fetchByUsername(req.body.user);
    console.log(user);
    

    //check credentials
    if(user.email=="null@admin" && user.isPersisted() && user.password=="admin"){
        req.session.user=user;
        res.render('admin',{
            title: 'Admin page',
            user:req.session.user,
            linkActive:'admin'
        });
    }
    else if (user.isPersisted() &&
        user.checkPassword(req.body.password)) {


        //if successful, redirect to the main page
        req.session.user = user;
        res.redirect("/")

    } else {

        res.render('login', {
            title: 'Prijava',
            user: req.session.user,
            linkActive: 'login',
            err: 'Neispravno ime ili lozinka.'
        });
    }
});


module.exports = router;