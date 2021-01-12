const express = require('express');
const Vlasnik = require('../models/VlasnikModel');
const router = express.Router();

router.get('/', async (req, res, next) => {
    if (req.session.user !== undefined && req.session.user.uloga == 'vlasnik') {

        let v = await Vlasnik.getAvailableVehicles();
        let r = await Vlasnik.getActiveReservations();
        let ar = await Vlasnik.getAllReservations();
        let av = await Vlasnik.getAllVehicles();

        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: v,
            reservations: r,
            allReservations: ar,
            allVehicles: av,
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

    let v = await Vlasnik.getAvailableVehicles();
    let r = await Vlasnik.getActiveReservations();
    let ar = await Vlasnik.getAllReservations();
    let av = await Vlasnik.getAllVehicles();

    res.render('owner', {
        title: 'vlasnik page',
        user: req.session.user,
        linkActive: 'vlasnik',
        vehicles: v,
        reservations: r,
        allReservations: ar,
        allVehicles: av,
        poruka: postMsg
    });
});
module.exports = router;