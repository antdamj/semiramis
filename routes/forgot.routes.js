const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');


router.get('/', (req, res, next) => {
    if (req.session.user !== undefined) {
        res.render('login', {
            title: 'Prijava',
            user: req.session.user,
            linkActive: 'login',
            err: 'Molimo Vas da se prvotno odjavite.'
        });
        return;
    }

    res.render('forgot', {
        title: 'Prijava',
        linkActive: 'forgot',
        user: undefined,
        err: undefined,
        msg: undefined
    });
    return;
});


router.post('/', async (req, res, next) => {

    //check if already logged in
    if (req.session.user !== undefined) {
        res.render('login', {
            title: 'Prijava',
            user: req.session.user,
            linkActive: 'login',
            err: 'Molimo Vas da se prvotno odjavite.'
        });
        return;
    }

    let user = await User.fetchByUsername(req.body.korisnickoIme)

    if(!user.isPersisted()) {
        res.render('forgot', {
            title: 'Prijava',
            user: req.session.user,
            linkActive: 'forgot',
            err: 'Nepostojeće korisničko ime.'
        });
        return;
    }
    
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'halikarnas.autos@gmail.com',
        pass: 'HalikarnaS!'
    }
    
    });

    const mailOptions = {
        from: 'halikarnas.autos@gmail.com',
        to: user.email,
        subject: 'Zaboravljena lozinka',
        text: 'Vaša je lozinka \'' + user.lozinka + '\'. Obavezno promijenite lozinku čim se prijavite!' +
                ' Možete se prijaviti na sljedećoj poveznici: http://halikarnas-autos.duckdns.org/login'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error);

            res.render('forgot', {
                title: 'Prijava',
                linkActive: 'forgot',
                user: undefined,
                err: error,
                msg: undefined
            });
            return;
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.render('forgot', {
        title: 'Prijava',
        linkActive: 'forgot',
        user: undefined,
        err: undefined,
        msg: 'Poveznica za postavljanje nove lozinke poslana Vam je na elektroničku poštu.'
    });
    return;


});

module.exports = router;