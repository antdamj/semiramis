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
            allVehicles: av
        });
    }
    else {
        res.status(403).send('<h1>Nemate dovoljna prava za ovu stranicu</h1> <h2>403 Forbidden!</h2>')
    }
}

);

router.post('/', async (req, res) => {

    let v = await Vlasnik.getAvailableVehicles();
    let r = await Vlasnik.getActiveReservations();
    let ar = await Vlasnik.getAllReservations();
    let av = await Vlasnik.getAllVehicles();

    if ('registracijaAdd' in req.body) {
        await Vlasnik.addVehicle(req.body.registracijaAdd, req.body.markaAdd, req.body.modelAdd, req.body.kategorijaAdd, req.body.cijenadanAdd, req.body.slikaurlAdd);
    }
    if ('registracijaDel' in req.body) {
        await Vlasnik.removeVehicle(req.body.registracijaDel);
    }
    if ('registracijaEdit' in req.body) {
        await Vlasnik.editVozilo(req.body.registracijaEdit, req.body.kategorijaEdit, req.body.cijenadanEdit, req.body.slikaurlEdit);
    }
    if ('rezervacijaClose' in req.body) {
        await Vlasnik.closeReservation(req.body.rezervacijaClose);
    }

    res.render('owner', {
        title: 'vlasnik page',
        user: req.session.user,
        linkActive: 'vlasnik',
        vehicles: v,
        reservations: r,
        allReservations: ar,
        allVehicles: av
    });
});
module.exports = router;