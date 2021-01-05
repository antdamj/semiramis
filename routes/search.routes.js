const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async function (req, res, next) {
   
    let poslovnicaDb= await db.query('SELECT * FROM poslovnica');

    res.render('search', {
        title: 'Pretraga',
        user: req.session.user,
        linkActive: 'search',      //TODO 
        locations: poslovnicaDb.rows,
        cars: "",
        isHidden:false,
        err: undefined
    });
});

router.post('/',async function(req,res,next){
    //let carsDb=await db.query('select * from vozilo left outer join rezervacija on rezervacija.registracija = vozilo.registracija where (zeljeniPocetni) > vrijemePreuzimanja or (zeljeniZavrsni) < vrijemeZavrsetka or idRezervacija is null');
    //let carsDb=await db.query('select * from vozilo where marka = '+"'Renault'");

    let poslovnicaDb= await db.query('SELECT * FROM poslovnica');


    let datum_primitka=req.body.datum_primitka+" "+req.body.vrijeme_primitka+":00";
    let datum_povratka=req.body.datum_povratka+" "+req.body.vrijeme_povratka+":00";
    let primitak=new Date(datum_primitka);
    let povratak=new Date(datum_povratka);
    
    let carsDb=await db.query(`select vozilo.* from vozilo left outer join rezervacija on rezervacija.registracija = vozilo.registracija where  '${datum_primitka}'  > vrijemePreuzimanja or  '${datum_povratka}'  < vrijemeZavrsetka or idRezervacija is null`);

    let today=Date.now();
    let nadoknada =false;
    if(primitak.getHours()< 9 || primitak.getHours()>15 || povratak.getHours()<9 || povratak.getHours()>15){
        nadoknada=true;
    }
    else{
        nadoknada=false;
    }
    let categories=[];
    for(let i=0;i<carsDb.rows.length;i++){
        if(!categories.includes(carsDb.rows[i].kategorija)){
            categories.push(carsDb.rows[i].kategorija);
        }
    }
    //console.log(categories);

    //console.log(primitak.getHours());
    //console.log("Primitak "+primitak+" povratak "+povratak+" danas "+today);
    //console.log("HELLO: "+newDate.getTime()+" "+Date.now());
    if(primitak.getTime()<today || povratak.getTime()<today){
        console.log(1);
        res.render('search', {
            title: 'Pretraga',
            user: req.session.user,
            linkActive: 'search',     
            cars: carsDb.rows,
            locations: poslovnicaDb.rows,
            isHidden:false,
            err:"Datum primitka ili povratka ne smije biti prije današnjeg datuma."
        });
    }
    else if(povratak.getTime()<=primitak.getTime()){
        console.log(2);
        res.render('search', {
            title: 'Pretraga',
            user: req.session.user,
            linkActive: 'search',      
            cars: carsDb.rows,
            locations: poslovnicaDb.rows,
            isHidden:false,
            err:"Datum povratka ne smije biti prije datuma primitka."
        });
    }
    else{
        res.render('search', {
            title: 'Pretraga',
            user: req.session.user,
            linkActive: 'search',     
            cars: carsDb.rows,
            locations: poslovnicaDb.rows,
            isHidden:true,
            err:undefined,
            nadoknada:nadoknada,
            categories: categories
        });
    }
    

});

//Ovo je fetch koji se triba napraviti,jos nisan siguran zasto ne funkcionira pravilno

router.get('/:id/:payment', async function (req, res, next) {

    /* 
    Mos samo ovo 
         res.status(200).send({registracija: req.params.id,placanje:req.params.payment});
    */

    //Moj pokusaj reroutanja
    let poslovnicaDb= await db.query('SELECT * FROM poslovnica');

    if(req.params.payment==="cash"){
        console.log(1);
        res.render('search', {
            title: 'Pretraga',
            user: req.session.user,
            linkActive: 'search',      //TODO 
            locations: poslovnicaDb.rows,
            cars: "",
            isHidden:false,
            err: undefined
        });
    }
    else if(req.params.payment==="card"){
        console.log(2);

        res.render('search', {
            title: 'Pretraga',
            user: req.session.user,
            linkActive: 'search',      //TODO 
            locations: poslovnicaDb.rows,
            cars: "",
            isHidden:false,
            err: undefined
        });

    }
    else{
        console.log(3);

        res.render('search', {
            title: 'Pretraga',
            user: req.session.user,
            linkActive: 'search',      //TODO 
            locations: poslovnicaDb.rows,
            cars: "",
            isHidden:false,
            err: "Nije odabran način plačanja"
        });
    }
    res.end();
});


module.exports = router;