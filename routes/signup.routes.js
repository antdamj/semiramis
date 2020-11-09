const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
const app = require('../server')

//vrati signup stranicu
router.get('/', function (req, res, next) {
    res.render('Signup', {
        title: 'Registrirajte se',
        user: req.session.user,
        linkActive: 'signup',
        err: undefined
    });
});

//ZADATAK: registracija novog korisnika.
//Potrebno je dodati sljedeću funkcionalnost:
// - ako je prijava uspjela, povezati sjednicu s registriranim korisnikom
// - napraviti redirect na home stranicu
router.post('/', function (req, res, next) {

    (async () => {

        //provjeri istovjetnost unesenenih zaporki
        if (req.body.password1 != req.body.password2) {
            res.render('Signup', {
                title: 'Registracija',
                linkActive: 'signup',
                user: req.session.user,
                err: "Lozinke se ne podudaraju"
            })
            return
        }

        //dobavi podatke o korisniku iz baze podataka
        let user = await User.fetchByUsername(req.body.email)

        //ako korisnik postoji, javi grešku
        if (user.id !== undefined) {
            res.render('Signup', {
                title: 'Registrirajte se',
                linkActive: 'signup',
                user: req.session.user,
                err: "Korisničko ime već postoji"
            })
            return
        }

        //registriraj novog korisnika
        user = new User(req.body.email, req.body.firstName, req.body.lastName, req.body.email, req.body.phoneNumber, req.body.password1)

        /*
        req.app.users.createUser(req.body.email, req.body.password1, req.body.email)
        req.app.users.store();
        */
        await user.persist()

        req.session.user = user;
        res.redirect('/');
    })();
});


module.exports = router;