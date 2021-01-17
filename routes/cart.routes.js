const express = require('express');
const router = express.Router();
const db = require('../db');
const User = require('../models/UserModel');
const Rezervacija = require('../models/RezervacijaModel');
const Recenzija = require('../models/RecenzijaModel');
const { getActiveReservations } = require('../models/UserModel');


router.get('/', async function (req, res, next) {

    //potrebni podatci
    let aktivneRezervacije = await User.getActiveReservations(req.session.user.korisnickoime);
    let zavrseneRezervacije = await User.getPastReservations(req.session.user.korisnickoime);
    let aktivnePostoji = await User.activeExists(req.session.user.korisnickoime);
    let zavrsenePostoji = await User.doneExists(req.session.user.korisnickoime);

    res.render('cart', {
        title: 'Moje rezervacije',
        user: req.session.user,
        linkActive: 'cart',
        aktivne: aktivneRezervacije,
        zavrsene: zavrseneRezervacije,
        isHidden: false,
        err: undefined,
        aktivnePostoji: aktivnePostoji,
        zavrsenePostoji: zavrsenePostoji
    });
});

router.post('/', async function (req, res, next) {

    //potrebni podatci
    let aktivneRezervacije = await User.getActiveReservations(req.session.user.korisnickoime);
    let zavrseneRezervacije = await User.getPastReservations(req.session.user.korisnickoime);
    let aktivnePostoji = await User.activeExists(req.session.user.korisnickoime);
    let zavrsenePostoji = await User.doneExists(req.session.user.korisnickoime);
   
    

});

module.exports = router;