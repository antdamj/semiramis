const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')
const crypto = require('crypto');

router.get('/:oporavak/:korisnickoIme', async (req, res, next) => {

    let user = await User.fetchByUsername(req.params.korisnickoIme);


    if (user.isPersisted() && user.checkPassword(req.params.oporavak)) {
        req.session.user = user;
        
        res.render('reset', {
            title: 'Oporavak',
            user: req.session.user,
            linkActive: 'reset',
            err: undefined
        });
    } else {
        res.render('login', {
            title: 'Prijava',
            user: req.session.user,
            linkActive: 'login',
            err: 'Došlo je do pogreške.'
        });
    }

})

router.post('/', async (req, res, next) => {
    //provjeri istovjetnost unesenenih zaporki

    if (req.body.password1 != req.body.password2) {
        res.render('reset', {
            title: 'Oporavak',
            linkActive: 'reset',
            user: req.session.user,
            err: "Lozinke se ne podudaraju."
        })
        return
    }

    const new_hashed_password = crypto.createHash("sha1").update(req.body.password1).digest("hex");


    if (new_hashed_password === req.session.user.lozinka) {
        res.render('reset', {
            title: 'Oporavak',
            linkActive: 'reset',
            user: req.session.user,
            err: "Nova lozinka jednaka je trenutnoj lozinci."
        })
        return
    }
    
    User.changePassword(req.session.user.korisnickoime, new_hashed_password);
    req.session.user.lozinka = new_hashed_password;
    res.redirect('/');
});

module.exports = router;