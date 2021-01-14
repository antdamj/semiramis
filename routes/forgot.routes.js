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
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: 'halikarnas.autos@zohomail.eu',
            pass: 'HalikarnaS!'
        }
    
    });

    const mailOptions = {
        from: 'halikarnas.autos@zohomail.eu',
        to: user.email,
        subject: 'Zaboravljena lozinka',
        text: 'Poštovani, možete promijeniti lozinku na sljedećoj poveznici: http://halikarnas-autos.duckdns.org/reset/' + user.lozinka + '/' + user.korisnickoime + '    Želimo Vam ugodan dan, HALIKARNAS!'
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
            res.render('forgot', {
                title: 'Prijava',
                linkActive: 'forgot',
                user: undefined,
                err: undefined,
                msg: 'Poveznica za postavljanje nove lozinke poslana Vam je na elektroničku poštu.'
            });
            console.log('Email sent: ' + info.response);
        }
    });

});

module.exports = router;