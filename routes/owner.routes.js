const express = require('express');
const Vlasnik = require('../models/VlasnikModel');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
    if (req.session.user !== undefined && req.session.user.uloga == 'vlasnik') {

        let v = await Vlasnik.getAvailableVehicles();
        let resActive = await Vlasnik.getActiveReservations();
        let resInactive = await Vlasnik.getInactiveReservations();
        let resFinished = await Vlasnik.getFinishedReservations();
        let av = await Vlasnik.getAllVehicles();
        let ar = await db.query(`select * from rezervacija order by vrijemepreuzimanja desc`)
        ar = ar.rows
        // recenzije
        let rat = await db.query(`select * from rezervacija natural join recenzija order by vrijemepreuzimanja desc`)
        rat = rat.rows
        // statistika
        let st = await db.query(`select to_char(vrijemeZavrsetka, 'YYYY-MM') as mjesec, sum((vrijemezavrsetka::date - vrijemepreuzimanja::date) * cijenadan) as zarada from rezervacija natural join vozilo group by mjesec order by mjesec`)
        st = st.rows
        // poslovnice
        let loc = await db.query(`select * from poslovnica`)
        loc = loc.rows

        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: v,
            allReservations: ar,
            activeReservations: resActive,
            inactiveReservations: resInactive,
            finishedReservations: resFinished,
            allVehicles: av,
            ratings: rat,
            stats: st,
            locations: loc,
            poruka: ""
        });
    }
    else {
        res.status(403).render ('error', {greska: 1});
    }
}

);

router.post('/', async (req, res) => {

    console.log(req.body)

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
        if (req.body.kategorijaEdit != undefined && req.body.kategorijaEdit != '') await Vlasnik.editVoziloCategory(req.body.registracijaEdit, req.body.kategorijaEdit)
        if (req.body.cijenadanEdit != undefined && req.body.cijenadanEdit != '') await Vlasnik.editVoziloPrice(req.body.registracijaEdit, req.body.cijenadanEdit)
        if (req.body.slikaurlEdit != undefined && req.body.slikaurlEdit != '') await Vlasnik.editVoziloImg(req.body.registracijaEdit, req.body.slikaurlEdit)
        postMsg = "Vozilo uspješno uređeno!"
    }
    if ('rezervacijaClose' in req.body) {
        await Vlasnik.closeReservation(req.body.rezervacijaClose);
        postMsg = "Rezervacija uspješno zatvorena!"
    }
    if('rezervacijaOpen' in req.body) {
        await Vlasnik.openReservation(req.body.rezervacijaOpen);
        postMsg = 'Rezervacija je sada aktivna!'
    }
    if ('recenzijaDelete' in req.body) {
        await db.query(`delete from recenzija where idRezervacija = '${req.body.recenzijaDelete}'`)
        postMsg = "Recenzija uspješno uklonjena!"
    }

    let v = await Vlasnik.getAvailableVehicles();
    let resActive = await Vlasnik.getActiveReservations();
    let resInactive = await Vlasnik.getInactiveReservations();
    let resFinished = await Vlasnik.getFinishedReservations();
    let av = await Vlasnik.getAllVehicles();
    let ar = db.query(`select * from rezervacija order by vrijemezavrsetka desc`)
    ar = ar.rows
    let rat = await db.query(`select * from rezervacija natural join recenzija order by vrijemepreuzimanja desc`)
    rat = rat.rows
    let st = await db.query(`select to_char(vrijemeZavrsetka, 'YYYY-MM') as mjesec, sum((vrijemezavrsetka::date - vrijemepreuzimanja::date) * cijenadan) as zarada from rezervacija natural join vozilo group by mjesec order by mjesec`)
    st = st.rows
    let loc = await db.query(`select * from poslovnica`)
    loc = loc.rows

    res.render('owner', {
        title: 'vlasnik page',
        user: req.session.user,
        linkActive: 'vlasnik',
        vehicles: v,
        allReservations: ar,
        activeReservations: resActive,
        inactiveReservations: resInactive,
        finishedReservations: resFinished,
        allVehicles: av,
        ratings: rat,
        stats: st,
        locations: loc,
        poruka: postMsg
    });
});
module.exports = router;