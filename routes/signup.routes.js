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

<<<<<<< Updated upstream

//Potrebno je dodati sljedeću funkcionalnost:
// - ako je prijava uspjela, povezati sjednicu s registriranim korisnikom
// - napraviti redirect na home stranicu
=======
// Ako je prijava uspjela, povezati sjednicu s registriranim korisnikom
>>>>>>> Stashed changes
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
        let user = await User.fetchByUsername(req.body.username)

        //ako korisnik postoji, javi grešku
        if (user.korisnickoime !== undefined) {
            res.render('Signup', {
                title: 'Registrirajte se',
                linkActive: 'signup',
                user: req.session.user,
                err: "Korisničko ime već postoji"
            })
            return
        }

        //registriraj novog korisnika
        user = new User(req.body.username, req.body.firstName, req.body.lastName, req.body.email, req.body.password1, req.body.phoneNumber, 'korisnik');
<<<<<<< Updated upstream
        //console.log(user);
=======
>>>>>>> Stashed changes
        await user.persist()


        req.session.user = user;
        res.redirect('/');
    })();
});

module.exports = router;