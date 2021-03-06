const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async function (req, res, next) {

    let poslovnicaDb = await db.query('SELECT * FROM poslovnica');
    let d1 = new Date()
    let d2 = new Date()
    d2.setDate(d1.getDate() + 3)
    d1 = d1.toISOString().slice(0, 19).replace('T', ' ').substring(0, 10) // html kalendaru vrati datum u obliku yyyy-mm-dd
    d2 = d2.toISOString().slice(0, 19).replace('T', ' ').substring(0, 10)

    res.render('search', {
        title: 'Pretraga',
        user: req.session.user,
        linkActive: 'search',      //TODO 
        locations: poslovnicaDb.rows,
        date1: d1,
        date2: d2,
        cars: "",
        reservationData: {},
        isHidden: false,
        err: undefined
    });
});

router.post('/', async function (req, res, next) {

    let poslovnicaDb = await db.query('SELECT * FROM poslovnica');
    let now = new Date().toISOString().slice(0, 19).replace('T', ' '); // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime

    // ako postoji parametar 'paymentType', znaci da je prosao onaj dio s odabirom kartice i to je vraceno i to uspjesno pokupljeno.
    if ('paymentType' in req.body) {
        console.log("ide gas")
        console.log(req.body)
        console.log("username:", req.session.user.korisnickoime)

        await db.query(`insert into rezervacija(vrijemeRezervacije, vrijemePreuzimanja, vrijemeZavrsetka, lokacijaPreuzimanja, lokacijaOstavljanja, korisnickoIme, registracija, tipPlacanja, status) values('${now}', '${req.body.t1}', '${req.body.t2}', '${req.body.l1}', '${req.body.l2}', '${req.session.user.korisnickoime}', '${req.body.carId}', '${req.body.paymentType}', 'neaktivna');`);
        // ubuduće redirect na popis korisnikovih rezervacija
        res.redirect("/");
    }

    // ovaj je dio za slucaj u kojem je korisnik jos uvijek na odabiru vremena i lokacije.
    else {
        let datum_primitka = req.body.datum_primitka + " " + req.body.vrijeme_primitka + ":00";
        let datum_povratka = req.body.datum_povratka + " " + req.body.vrijeme_povratka + ":00";
        let primitak = new Date(datum_primitka);
        let povratak = new Date(datum_povratka);

        let podatciPotrebni = {
            t1: datum_primitka,
            t2: datum_povratka,
            l1: req.body.lokacija_primitka,
            l2: req.body.lokacija_povratka
        }

        // console.log(podatciPotrebni)

        let x = new Date().getTime()
        let prvi = "temp1".concat(x)
        let drugi = "temp2".concat(x)

        await db.query(`create view ${prvi} as select distinct vozilo.*, ('${datum_primitka}' < vrijemePreuzimanja or '${datum_povratka}' > vrijemeZavrsetka) as dostupnost from vozilo left outer join rezervacija on rezervacija.registracija = vozilo.registracija`)
        await db.query(`create view ${drugi} as select registracija, count(*) from ${prvi} group by registracija`)
        let carsDb = await db.query(`select * from ${drugi} natural join vozilo where count < 2`)
        await db.query(`drop view ${drugi}`)
        await db.query(`drop view ${prvi}`) 


        let today = Date.now();
        let nadoknada = false;
        if (primitak.getHours() < 9 || primitak.getHours() > 15 || povratak.getHours() < 9 || povratak.getHours() > 15) nadoknada = true;
        let categories = [];
        for (let i = 0; i < carsDb.rows.length; i++) {
            if (!categories.includes(carsDb.rows[i].kategorija)) {
                categories.push(carsDb.rows[i].kategorija);
            }
        }

        let d1 = new Date()
        let d2 = new Date()
        d2.setDate(d1.getDate() + 3)
        d1 = d1.toISOString().slice(0, 19).replace('T', ' ').substring(0, 10) // html kalendaru vrati datum u obliku yyyy-mm-dd
        d2 = d2.toISOString().slice(0, 19).replace('T', ' ').substring(0, 10)

        if (primitak.getTime() < today || povratak.getTime() < today) {
            console.log(1);
            res.render('search', {
                title: 'Pretraga',
                user: req.session.user,
                linkActive: 'search',
                cars: carsDb.rows,
                locations: poslovnicaDb.rows,
                date1: req.body.datum_primitka,
                date2: req.body.datum_povratka,
                reservationData: podatciPotrebni,
                isHidden: false,
                err: "Datum primitka ili povratka ne smije biti prije današnjeg datuma."
            });
        }
        else if (povratak.getTime() <= primitak.getTime()) {
            console.log(2);
            res.render('search', {
                title: 'Pretraga',
                user: req.session.user,
                linkActive: 'search',
                cars: carsDb.rows,
                locations: poslovnicaDb.rows,
                date1: req.body.datum_primitka,
                date2: req.body.datum_povratka,
                reservationData: podatciPotrebni,
                isHidden: false,
                err: "Datum povratka ne smije biti prije datuma primitka."
            });
        } else if (povratak.getTime() < primitak.getTime() + 259200000) { // 3 dana u ms; getTime() vraća ms
            console.log(2);
            res.render('search', {
                title: 'Pretraga',
                user: req.session.user,
                linkActive: 'search',
                cars: carsDb.rows,
                locations: poslovnicaDb.rows,
                date1: req.body.datum_primitka,
                date2: req.body.datum_povratka,
                reservationData: podatciPotrebni,
                isHidden: false,
                err: "Minimalno trajanje narudžbe mora biti 3 dana."
            });
        }
        else {
            res.render('search', {
                title: 'Pretraga',
                user: req.session.user,
                linkActive: 'search',
                cars: carsDb.rows,
                locations: poslovnicaDb.rows,
                date1: d1,
                date2: d2,
                reservationData: podatciPotrebni,
                isHidden: true,
                err: undefined,
                nadoknada: nadoknada,
                categories: categories
            });
        }
    }
});

module.exports = router;