const express = require('express');
const Vlasnik = require('../models/VlasnikModel');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
    if (req.session.user !== undefined && req.session.user.uloga == 'vlasnik') {

        let v = await Vlasnik.getAvailableVehicles();
        let r = await Vlasnik.getActiveReservations();
        let ar = await Vlasnik.getAllReservations();
        let av = await Vlasnik.getAllVehicles();
        let rat = await db.query(`select * from rezervacija natural join recenzija`)
        rat = rat.rows
        let st = await db.query(`select to_char(rezervacija.vrijemeZavrsetka, 'YYYY-MM') as mjesec, sum(vozilo.cijenadan) as zarada from rezervacija natural join vozilo group by mjesec order by mjesec`)
        st = st.rows

        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: v,
            reservations: r,
            allReservations: ar,
            allVehicles: av,
            ratings: rat,
            stats: st,
            poruka: ""
        });
    }
    else {
        res.status(403).send('<h1>Nemate dovoljna prava za ovu stranicu</h1> <h2>403 Forbidden!</h2>')
    }
}

);

router.post('/', async (req, res) => {

    let postMsg

    if ('registracijaAdd' in req.body) {
        await Vlasnik.addVehicle(req.body.registracijaAdd, req.body.markaAdd, req.body.modelAdd, req.body.kategorijaAdd, req.body.cijenadanAdd, req.body.slikaurlAdd);
        postMsg = "Vozilo uspješno dodano!"
    }
    if ('registracijaDel' in req.body) {
        await Vlasnik.removeVehicle(req.body.registracijaDel);
        postMsg = "Vozilo uspješno uklonjeno!"
    }
    if ('registracijaEdit' in req.body) {
        await Vlasnik.editVozilo(req.body.registracijaEdit, req.body.kategorijaEdit, req.body.cijenadanEdit, req.body.slikaurlEdit);
        postMsg = "Vozilo uspješno uređeno!"
    }
    if ('rezervacijaClose' in req.body) {
        await Vlasnik.closeReservation(req.body.rezervacijaClose);
        postMsg = "Rezervacija uspješno zatvorena!"
    }
    if ('recenzijaDelete' in req.body) {
        await db.query(`delete from recenzija where idRezervacija = '${req.body.recenzijaDelete}'`)
        postMsg = "Recenzija uspješno uklonjena!"
    }

    let v = await Vlasnik.getAvailableVehicles();
    let r = await Vlasnik.getActiveReservations();
    let ar = await Vlasnik.getAllReservations();
    let av = await Vlasnik.getAllVehicles();
    let rat = await db.query(`select * from rezervacija natural join recenzija`)
    rat = rat.rows
    let st = await db.query(`select to_char(rezervacija.vrijemeZavrsetka, 'YYYY-MM') as mjesec, sum(vozilo.cijenadan) from rezervacija natural join vozilo group by mjesec order by mjesec`)
    st = st.rows

    res.render('owner', {
        title: 'vlasnik page',
        user: req.session.user,
        linkActive: 'vlasnik',
        vehicles: v,
        reservations: r,
        allReservations: ar,
        allVehicles: av,
        ratings: rat,
        stats: st,
        poruka: postMsg
    });
});
module.exports = router;