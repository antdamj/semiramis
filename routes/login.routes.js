const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
const crypto = require('crypto');


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
    const hashed_password = crypto.createHash("sha1").update(req.body.lozinka).digest("hex");

    if (user.isPersisted() && user.checkPassword(hashed_password)) {
        req.session.user = user
        if (user.uloga == 'admin') res.redirect("/admin")
        if (user.uloga == 'vlasnik') res.redirect("/owner")
        else res.redirect("/")
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