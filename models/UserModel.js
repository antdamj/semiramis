const db = require('../db')

//razred User enkapsulira korisnika
module.exports = class User {

    //konstruktor korisnika
    constructor(username, first_name, last_name, email, password, phoneNumber, role = "korisnik") {
        this.korisnickoime = username
        this.ime = first_name
        this.prezime = last_name
        this.email = email
        this.lozinka = password
        this.brojmobitela = phoneNumber
        this.uloga = role
    }

    //dohvat korisnika na osnovu korisničkog imena (email kod signup procedure)
    static async fetchByUsername(username) {

        let results = await dbGetUserByName(username)
        console.log(results);
        let newUser = new User()

        if (results.length > 0) {
            newUser = new User(results[0].korisnickoime, results[0].ime,
                results[0].prezime, results[0].email, results[0].lozinka, results[0].brojmobitela, results[0].uloga)
        }
        return newUser
    }

    //je li korisnik pohranjen u bazu podataka?
    isPersisted() {
        return this.korisnickoime !== undefined
    }

    //provjera zaporke
    checkPassword(password) {
        return this.lozinka ? this.lozinka == password : false
    }

    //pohrana korisnika u bazu podataka
    async persist() {
        try {
            let userName = await dbNewUser(this)
            this.korisnickoime = userName
        } catch (err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }
}

//dohvat korisnika iz baze podataka na osnovu korisničkog imena (stupac korisnickoIme)
dbGetUserByName = async (user_name) => {
    const sql = `SELECT * FROM korisnik WHERE korisnickoIme = '` + user_name + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//umetanje zapisa o korisniku u bazu podataka
dbNewUser = async (user) => {
    const sql = "INSERT INTO korisnik (korisnickoIme, ime, prezime, email, lozinka, brojMobitela, uloga) VALUES ('" +
        user.user_name + "', '" + user.first_name + "', '" + user.last_name + "', '" +
        user.email + "', '" + user.password + "', '" + user.phoneNumber + "', '" + user.role + "') RETURNING korisnickoIme";
    try {
        const result = await db.query(sql, []);
        return result.rows[0].id;
    } catch (err) {
        console.log(err);
        throw err
    }
}
