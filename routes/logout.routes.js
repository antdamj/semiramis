const express = require('express');
const router = express.Router();

//ZADATAK:
// - obrisati sadržaj košarice
// - odjaviti registriranog korisnika iz sustava
// - napraviti redirect na osnovnu stranicu
router.get('/', (req, res, next) => {

    req.session.user = undefined;
    req.session.destroy((err) => {
        if (err) console.log(err)
        else res.redirect('/')
    })
});

module.exports = router;