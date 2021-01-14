const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const crypto = require('crypto');
const { fetchByUsername } = require('../models/UserModel');
const db = require('../db')


//prikaz podataka o korisniku (podaci o korisniku, adrese, narudžbe)
router.get('/', function (req, res, next) {
    (async () => {
        if (req.session.user === undefined) {
            res.redirect('/user')
            return
        }

        res.render('user', {
            title: 'Korisnički profil',
            user: req.session.user,
            linkActive: 'user',
            err: undefined,
            msg: undefined
        });
    })()
});

router.post('/', async (req, res, next) => {
    //promjena korisničkih podataka
    if ('name' in req.body || 'lastname' in req.body || 'email' in req.body) {
        console.log("Promjena korisničkih podataka")
        if('name' in req.body && req.body.name != '') {
            await User.changeName(req.session.user.korisnickoime, req.body.name);
        }
        if('lastname' in req.body && req.body.lastname != '') {
            await User.changeLastName(req.session.user.korisnickoime, req.body.lastname);
        }
        if('email' in req.body && req.body.email != '') {
            await User.changeEmail(req.session.user.korisnickoime, req.body.email);
        }
        if (req.body.name.length > 0) req.session.user.ime = req.body.name
        if (req.body.lastname.length > 0) req.session.user.prezime = req.body.lastname
        if (req.body.email.length > 0) req.session.user.email = req.body.email
        res.render('user', {
            title: 'User page',
            user: req.session.user,
            linkActive: 'user',
            users: "",
            locations: "",
            err: undefined,
            msg: undefined
        })
        return
    }

    //brisanje korisničkog računa
    if ('delete' in req.body) {
        console.log("Brisanje korisničkog računa")
        await User.deleteUser(req.session.user.korisnickoime)
        
        req.session.user = undefined;
        req.session.destroy((err) => {
        if (err) console.log(err) })
        res.render('home', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: undefined,
            err: undefined,
            msg: undefined
        });
        return
    }

    //----------------LOZINKE----------------
    //provjeri istovjetnost unesenenih zaporki
    if (req.body.password1 != req.body.password2) {
        res.render('user', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: req.session.user,
            err: "Lozinke se ne podudaraju.",
            msg: undefined
        })
        return
    }
    //ako je nova lozinka jednaka trenutnoj, javi grešku
    if (req.body.password == req.body.password1) {
        res.render('user', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: req.session.user,
            err: "Nova lozinka jednaka je trenutnoj lozinci.",
            msg: undefined

        })
        return
    }
    const hashed_password = crypto.createHash("sha1").update(req.body.password).digest("hex");

    if (hashed_password !== req.session.user.lozinka) {
        res.render('user', {
            title: 'Korisnički profil',
            linkActive: 'user',
            user: req.session.user,
            err: "Neispravna trenutna lozinka.",
            msg: undefined
        })
        return
    }
    const new_hashed_password = crypto.createHash("sha1").update(req.body.password1).digest("hex");
    User.changePassword(req.session.user.korisnickoime, new_hashed_password);
    req.session.user.lozinka = new_hashed_password;
    res.render('user', {
        title: 'Korisnički profil',
        linkActive: 'user',
        user: req.session.user,
        err: undefined,
        msg: "Uspješno promijenjena lozinka"
    })
});

module.exports = router;
