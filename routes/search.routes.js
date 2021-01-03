const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async function (req, res, next) {
   
    let poslovnicaDb= await db.query('SELECT * FROM poslovnica');

    /*
    let datum_primitka = new Date();
    let datum_povratka = new Date(datum_primitka);
    datum_povratka.setDate(datum_povratka.getDate() + 1)
    
    let day=datum_primitka.getDate();
    let month=datum_primitka.getMonth()+1;
    let year=datum_primitka.getFullYear();
    
    
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    let maxDate = year + '-' + month + '-' + day; 
    let newDate=new Date(maxDate);
    */

    res.render('search', {
        title: 'Pretraga',
        user: req.session.user,
        linkActive: 'search',      //TODO 
        locations: poslovnicaDb.rows,
        cars: "",
        isHidden:false
    });
});

router.post('/',async function(req,res,next){
    let carsDb=await db.query('SELECT * FROM vozilo');
    let poslovnicaDb= await db.query('SELECT * FROM poslovnica');


    console.log(req.body);
    let date=req.body.datum_primitka+" "+req.body.vrijeme_primitka;
    console.log(date);
    res.render('search', {
        title: 'Pretraga',
        user: req.session.user,
        linkActive: 'search',      //TODO 
        cars: carsDb.rows,
        locations: poslovnicaDb.rows,
        isHidden:true
    });

})

module.exports = router;