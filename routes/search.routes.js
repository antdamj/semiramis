const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async function (req, res, next) {
    let carsDb=await db.query('SELECT * FROM vozilo');
    console.log(carsDb.rows);
    res.render('search', {
        title: 'Pretraga',
        user: req.session.user,
        linkActive: 'search',      //TODO 
        cars: carsDb.rows
    });
});

module.exports = router;