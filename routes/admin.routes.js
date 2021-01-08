const express = require('express');
const Administrator = require('../models/AdministratorModel');
const router = express.Router();
const db = require('../db')

router.get('/', (req, res, next) => {
    if (req.session.user !== undefined && req.session.user.uloga == 'admin') {
        res.render('admin', {
            title: 'Admin page',
            user: req.session.user,
            linkActive: 'admin',
            users: "",
            locations:""
        });
    }
    else {
        res.status(403).send('<h1>Nemate dovoljna prava za ovu stranicu</h1> <h2>403 Forbidden!</h2>')
    }
});

router.post('/', async (req, res) => {
    
    if ('getUsers' in req.body) {
        console.log("Pretraga korisnika.")

        if (req.body.getUsers.length == 0) tablice = await Administrator.getUsers();
        else tablice = await Administrator.getByRole(req.body.getUsers);
       
        res.render('admin', {
            title: 'Admin page',
            user: req.session.user,
            linkActive: 'admin',
            users: tablice.rows,
            locations: ""
        });
    }

    if ('userDelete' in req.body) {
        console.log("Brisanje korisnika.")
        await Administrator.removeUser(req.body.userDelete);
        res.render('admin', {
            title: 'Admin page',
            user: req.session.user,
            linkActive: 'admin',
            users: "",
            locations: ""
        });
    }

    if ('userEdit' in req.body) {
       // console.log("Dodavanje vlasnickih prava korisniku.")
        await Administrator.giveOwnerToUser(req.body.userEdit);
        res.render('admin', {
            title: 'Admin page',
            user: req.session.user,
            linkActive: 'admin',
            users: "",
            locations: ""
        });
    }

    if ('getLocations' in req.body) {
        console.log("Pretraga poslovnica.")
        let tablice = await Administrator.getLocations();
        res.render('admin', {
            title: 'Admin page',
            user: req.session.user,
            linkActive: 'admin',
            users: "",
            locations: tablice.rows
        });
    }

    if ('locationAdd' in req.body) {
        console.log("Dodavanje poslovnice.")
        await Administrator.addLocation(req.body.locationAdd);
        res.render('admin', {
            title: 'Admin page',
            user: req.session.user,
            linkActive: 'admin',
            users: "",
            locations: ""
        });
    }

    if ('locationRemove' in req.body) {
        console.log("Uklanjanje poslovnice.")
        await Administrator.removeLocation(req.body.locationRemove);
        res.render('admin', {
            title: 'Admin page',
            user: req.session.user,
            linkActive: 'admin',
            users: "",
            locations: ""
        });
    }

    if ('locationEdit' in req.body) {
        console.log("Uredivanje poslovnice.")
        await Administrator.editLocation(req.body.locationEdit[0], req.body.locationEdit[1]);
        res.render('admin', {
            title: 'Admin page',
            user: req.session.user,
            linkActive: 'admin',
            users: "",
            locations: ""
        });
    }
});

module.exports = router;