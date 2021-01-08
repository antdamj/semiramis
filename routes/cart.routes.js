const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/', function (req, res, next) {

    res.render('cart', {
        title: 'Moje rezervacije',
        user: req.session.user,
        linkActive: 'cart',
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