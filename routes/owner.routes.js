const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (req.session.user !== undefined && req.session.user.uloga == 'vlasnik') {
        res.render('owner', {
            title: 'vlasnik page',
            user: req.session.user,
            linkActive: 'vlasnik'
        });
    }
    else {
        res.status(403).send('<h1>Nemate dovoljna prava za ovu stranicu</h1> <h2>403 Forbidden!</h2>')
    }
});
module.exports = router;