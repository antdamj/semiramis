const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const crypto = require('crypto');



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
        res.render('user', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: req.session.user,
            err: "Lozinke se ne podudaraju."
        })
        return
    }
    //ako je nova lozinka jednaka trenutnoj, javi grešku
    if (req.body.password == req.body.password1) {
        res.render('user', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: req.session.user,
            err: "Nova lozinka jednaka je trenutnoj lozinci."
        })
        return
    }
    const hashed_password = crypto.createHash("sha1").update(req.body.password).digest("hex");

    if (hashed_password !== req.session.user.lozinka) {
        res.render('user', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: req.session.user,
            err: "Neispravna trenutna lozinka."
        })
        return
    }
    const new_hashed_password = crypto.createHash("sha1").update(req.body.password1).digest("hex");
    User.changePassword(req.session.user.korisnickoime, new_hashed_password);
    req.session.user.lozinka = new_hashed_password;
    res.redirect('/');
});

module.exports = router;
