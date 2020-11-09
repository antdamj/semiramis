const express = require('express');
const router = express.Router();


//prikaz podataka o korisniku (podaci o korisniku, adrese, narudžbe)
router.get('/', function (req, res, next) {

    (async () => {

        //ako korisnik nije logiran, redirekcija na osnovnu stranicu
        if (req.session.user === undefined) {
            res.redirect('/')
            return
        }

        //dobavi narudžbe korisnika
        //let orders = await Order.fetchByUser(req.session.user)

        res.render('user', {
            title: 'Korisnički profil',
            user: req.session.user,
            //orders: orders,
            linkActive: 'user'
        });
    })()
});

module.exports = router;