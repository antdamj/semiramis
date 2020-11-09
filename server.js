//uvoz modula
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg')
const db = require('./db')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)

//uvoz modula s definiranom funkcionalnosti ruta
const homeRouter = require('./routes/home.routes');
const loginRoute = require('./routes/login.routes');
const logoutRoute = require('./routes/logout.routes');
const signupRoute = require('./routes/signup.routes');
const adminRoute = require('./routes/admin.routes');
const userRoute = require('./routes/user.routes');
const userData = require('./models/UserData');


//middleware - predlošci (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware - statički resursi
app.use(express.static(path.join(__dirname, 'public')));

//middleware - dekodiranje parametara
app.use(express.urlencoded({
    extended: true
}));

//middleware - upravljanje sjednicama (+ trajne sjednice u bazi podataka)
//ZADATAK: postaviti express-sessions midlleware, trajnost sjedničkog kolačića 1 dan,
//pohrana sjednica u postgres bazu korštenjem connect-pg-simple modula
app.use(session({
    secret: 'armavirumquecanotroiaequiprimusaboris',
    store: new pgSession({
        pool: db.pool,
        tableName: 'session'
    }),
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, //1 day
        secure: false
    },
    saveUninitialized: true
}));


//definicija ruta
app.use('/', homeRouter);
app.use('/login', loginRoute)
app.use('/logout', logoutRoute)
app.use('/signup', signupRoute)
app.use('/user', userRoute)
app.use('/admin',adminRoute);


app.users = new userData('./data/users.json');
app.users.initialize(true);

//pokretanje poslužitelja na portu 3000
app.get('*', function(req, res){
    res.status(404).send('<h1>404 Error occured</h1><h2>Posjetili ste stranicu koja ne postoji</h2><h2>Pritisnite <a href="/" class="link menu-item">tu</a> da se vratite </h2>');
  });
app.listen(3000);