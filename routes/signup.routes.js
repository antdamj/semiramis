const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
const crypto = require('crypto');

//vrati signup stranicu
router.get('/', function (req, res, next) {
    res.render('signup', {
        title: 'Registrirajte se',
        user: req.session.user,
        linkActive: 'signup',
        err: undefined
    });
});

// Ako je prijava uspjela, povezati sjednicu s registriranim korisnikom
router.post('/', function (req, res, next) {
    (async () => {

        //provjeri istovjetnost unesenenih zaporki
        if (req.body.password1 != req.body.password2) {
            res.render('signup', {
                title: 'Registracija',
                linkActive: 'signup',
                user: req.session.user,
                err: "Lozinke se ne podudaraju"
            })
            return
        }

        //dobavi podatke o korisniku iz baze podataka
        let user = await User.fetchByUsername(req.body.username)

        //ako korisnik postoji, javi grešku
        if (user.korisnickoime !== undefined) {
            res.render('signup', {
                title: 'Registrirajte se',
                linkActive: 'signup',
                user: req.session.user,
                err: "Korisničko ime već postoji"
            })
            return
        }

        const hashed_password = crypto.createHash("sha1").update(req.body.password1).digest("hex");

        //registriraj novog korisnika
        user = new User(req.body.username, req.body.firstName, req.body.lastName, req.body.email, hashed_password, req.body.phoneNumber, 'korisnik');
        await user.persist()

        req.session.user = user;
        res.redirect('/');
    })();
});

module.exports = router;