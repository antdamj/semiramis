const express = require('express');
const router = express.Router();
const db = require('../db');
const User = require('../models/UserModel');


router.get('/', async function (req, res, next) {

    let aktivneRezervacije = await User.getActiveReservations(req.session.user.korisnickoime);
    let zavrseneRezervacije = await User.getPastReservations(req.session.user.korisnickoime);

    res.render('cart', {
        title: 'Moje rezervacije',
        user: req.session.user,
        linkActive: 'cart',
        aktivne: aktivneRezervacije,
        zavrsene: zavrseneRezervacije,
        isHidden: false,
        err: undefined
    });
});

router.post('/', async function (req, res, next) {

    //potrebni podatci
    let aktivneRezervacije = dbGetActiveReservations();
    let zavrseneRezervacije = dbGetPastReservations();
   
    if(true) {
        res.render('cart', {
            title: 'Moje rezervacije',
            user: req.session.user,
            linkActive: 'cart',
            aktivne: aktivneRezervacije,
            zavrsene: zavrseneRezervacije,
            isHidden: false,
            err: undefined
        })
    }

});

module.exports = router;