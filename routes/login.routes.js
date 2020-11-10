const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
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

    let user = await User.fetchByUsername(req.body.korisnickoIme);
    console.log("Login > ");
    console.log(user);

    //check credentials

    if (user.isPersisted() && user.uloga == 'admin' && user.checkPassword(req.body.lozinka)) {
        req.session.user = user;
        res.redirect("/admin");
    } else if (user.isPersisted() && user.uloga == 'vlasnik' && user.checkPassword(req.body.lozinka)) {
        req.session.user = user;
        res.redirect("/owner");
    } else if (user.isPersisted() && user.checkPassword(req.body.lozinka)) {
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