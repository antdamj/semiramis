const express = require('express');
const Vlasnik = require('../models/VlasnikModel');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.user !== undefined && req.session.user.uloga == 'vlasnik') {
        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: "",
            reservations: "",
            allReservations: "",
            allVehicles: ""
        });
    }
    else {
        res.status(403).send('<h1>Nemate dovoljna prava za ovu stranicu</h1> <h2>403 Forbidden!</h2>')
    }
}

);

router.post('/', async (req, res) => { 
    if ('registracijaAdd' in req.body) {
        
        await Vlasnik.addVehicle(req.body.registracijaAdd , req.body.markaAdd, req.body.modelAdd, req.body.kategorijaAdd, req.body.cijenadanAdd, req.body.slikaurlAdd);
        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: "",
            reservations: "",
            allReservations: "",
            allVehicles: ""
        });

    } 
    if('registracijaDel' in req.body) {
        await Vlasnik.removeVehicle(req.body.registracijaDel);
        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: "",
            reservations: "",
            allReservations: "",
            allVehicles: ""
        });
    }
    if('registracijaEdit' in req.body) {
        await Vlasnik.editVozilo(req.body.registracijaEdit, req.body.kategorijaEdit, req.body.cijenadanEdit, req.body.slikaurlEdit);
        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: "",
            reservations: "",
            allReservations: "",
            allVehicles: ""
        });
    } 
    if('rezervacijaClose' in req.body) {
        await Vlasnik.closeReservation(req.body.rezervacijaClose);
        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: "",
            reservations: "",
            allReservations: "",
            allVehicles: ""
        });
    } 
    if('getVehicles' in req.body) {
        let tablice=await Vlasnik.getAvailableVehicles();
        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: tablice,
            reservations: "",
            allReservations: "",
            allVehicles: ""
        });
    }
    if('getActiveRes' in req.body) {
        let tablice=await Vlasnik.getActiveReservations();
        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: "",
            reservations: tablice,
            allReservations: "",
            allVehicles: ""
        });
    }
    if('getAllRes' in req.body) {
            let tablice=await Vlasnik.getAllReservations();
            res.render('owner', {
                title: 'vlasnik page',
                user: req.session.user,
                linkActive: 'vlasnik',
                vehicles: "",
                reservations: "",
                allReservations: tablice,
                allVehicles: ""
            });
    }
    if('getAllVehicles' in req.body) {
        let tablice=await Vlasnik.getAllVehicles();
        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik',
            vehicles: "",
            reservations: "",
            allReservations: "",
            allVehicles: tablice
        });
}
});
module.exports = router;