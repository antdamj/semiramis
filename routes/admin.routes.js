const express = require('express');
const Administrator = require('../models/AdministratorModel');
const router = express.Router();
const db = require('../db')

router.get('/', async (req, res) => {
    if (req.session.user !== undefined && req.session.user.uloga == 'admin') {

        let u = await Administrator.getUsers()
        u = u.rows
        let l = await Administrator.getLocations()
        l = l.rows

        res.render('admin', {
            title: 'Admin page',
            user: req.session.user,
            linkActive: 'admin',
            users: u,
            locations: l,
            poruka: ""
        });
    }
    else {
        res.status(403).send('<h1>Nemate dovoljna prava za ovu stranicu</h1> <h2>403 Forbidden!</h2>')
    }
});

router.post('/', async (req, res) => {

    let postMsg

    if ('userDelete' in req.body) {
        console.log("Brisanje korisnika.")
        await Administrator.removeUser(req.body.userDelete)
        postMsg = "Korisnik uspješno izbrisan!"
    }

    if ('userEdit' in req.body) {
        console.log("Dodavanje vlasnickih prava korisniku.")
        await Administrator.giveOwnerToUser(req.body.userEdit);
        postMsg = "Korisnik uspješno pretvoren u vlasnika!"
    }

    if ('locationAdd' in req.body) {
        console.log("Dodavanje poslovnice.")
        await Administrator.addLocation(req.body.locationAdd, req.body.phoneAdd);
        postMsg = "Lokacija uspješno dodana!"
    }

    if ('locationRemove' in req.body) {
        console.log("Uklanjanje poslovnice.")
        await Administrator.removeLocation(req.body.locationRemove);
        postMsg = "Lokacija uspješno izbrisana!"
    }

    if ('locationEdit' in req.body) {
        console.log("Uredivanje poslovnice.")
        await Administrator.editLocation(req.body.locationEdit[0], req.body.locationEdit[1], req.body.phoneEdit);
        postMsg = "Lokacija uspješno uređena!"
    }

    let u = await Administrator.getUsers()
    u = u.rows
    let l = await Administrator.getLocations()
    l = l.rows

    res.render('admin', {
        title: 'Admin page',
        user: req.session.user,
        linkActive: 'admin',
        users: u,
        locations: l,
        poruka: postMsg
    });
});

module.exports = router;