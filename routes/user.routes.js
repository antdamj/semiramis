const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

//prikaz podataka o korisniku (podaci o korisniku, adrese, narudžbe)
router.get('/', function (req, res, next) {
    (async () => {
        if (req.session.user === undefined) {
            res.redirect('/')
            return
        }

        res.render('user', {
            title: 'Korisnički profil',
            user: req.session.user,
            linkActive: 'user',
            err: undefined
        });
    })()
});

router.post('/', async (req, res, next) => {
    //provjeri istovjetnost unesenenih zaporki

    if (req.body.password1 != req.body.password2) {
        res.render('User', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: req.session.user,
            err: "Lozinke se ne podudaraju."
        })
        return
    }
    //ako je nova lozinka jednaka trenutnoj, javi grešku
    if (req.body.password == req.body.password1) {
        res.render('User', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: req.session.user,
            err: "Nova lozinka jednaka je trenutnoj lozinci."
        })
        return
    }

    if (req.body.password !== req.session.user.lozinka) {
        res.render('User', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: req.session.user,
            err: "Neispravna trenutna lozinka."
        })
        return
    }
    User.changePassword(req.session.user.korisnickoime, req.body.password1);
    req.session.user.lozinka = req.body.password1;
    res.redirect('/');
});

module.exports = router;