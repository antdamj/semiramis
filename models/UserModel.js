const db = require('../db')

//razred User enkapsulira korisnika
module.exports = class User {
    //konstruktor korisnika
    constructor(user_name, first_name, last_name, email, password, phoneNumber, role = "korisnik") {
        this.korisnickoime = user_name
        this.ime = first_name
        this.prezime = last_name
        this.email = email
        this.lozinka = password
        this.brojmobitela = phoneNumber
        this.uloga = role
    }

    //dohvat korisnika na osnovu korisničkog imena (email kod signup procedure)
    static async fetchByUsername(user_name) {

        let results = await dbGetUserByName(user_name)
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

    // promjena zaporke
    static async changePassword(username, password) {
        const sql = `UPDATE korisnik SET lozinka = '` + password + `' WHERE korisnickoime = '` + username + `'`;
        try {
            await db.query(sql, []);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    // promjena imena
    static async changeName(username, name) {
        const sql = `UPDATE korisnik SET ime = '` + name + `' WHERE korisnickoime = '` + username + `'`;
        try {
            await db.query(sql, []);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    // promjena prezimena
    static async changeLastName(username, lastname) {
        const sql = `UPDATE korisnik SET prezime = '` + lastname + `' WHERE korisnickoime = '` + username + `'`;
        try {
            await db.query(sql, []);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    // promjena emaila
    static async changeEmail(username, email) {
        const sql = `UPDATE korisnik SET email = '` + email + `' WHERE korisnickoime = '` + username + `'`;
        try {
            await db.query(sql, []);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    // brisanje korisnickog racuna
    static async deleteUser(username) {
        const sql = `DELETE FROM korisnik WHERE korisnickoime = '` + username + `'`;
            try {
                await db.query(sql, []);
            } catch (err) {
                console.log(err);
                throw err
            }
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

    //dohvat aktivnih rezervacija korisnika
    static async getActiveReservations(user_name) {
        const sql = `SELECT REZERVACIJA.korisnickoime, VOZILO.slikaURL, VOZILO.registracija, VOZILO.marka, VOZILO.model, VOZILO.cijenaDan, REZERVACIJA.vrijemepreuzimanja, REZERVACIJA.vrijemezavrsetka, REZERVACIJA.lokacijapreuzimanja, REZERVACIJA.lokacijaostavljanja, REZERVACIJA.status, REZERVACIJA.tipplacanja, RECENZIJA.ocjena, RECENZIJA.opis, p1.lokacija AS lokacijaostavljanja, p2.lokacija AS lokacijapreuzimanja
                        FROM rezervacija LEFT JOIN recenzija USING (idrezervacija)
                            JOIN vozilo USING (registracija)
                            JOIN POSLOVNICA AS p1 ON (rezervacija.lokacijaostavljanja = p1.idposlovnica)
                            JOIN POSLOVNICA AS p2 ON (rezervacija.lokacijapreuzimanja = p2.idposlovnica)
                    WHERE korisnickoime = '` + user_name + `' AND (status = 'aktivna' OR status = 'neaktivna')`;
        try {
            const result = await db.query(sql, []);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
    }
    

    //dohvat završenih rezervacija korisnika
    static async getPastReservations(user_name) {
        const sql = `SELECT REZERVACIJA.korisnickoime, VOZILO.slikaURL, VOZILO.registracija, VOZILO.marka, VOZILO.model, VOZILO.cijenaDan, REZERVACIJA.vrijemepreuzimanja, REZERVACIJA.vrijemezavrsetka, REZERVACIJA.lokacijapreuzimanja, REZERVACIJA.lokacijaostavljanja, REZERVACIJA.status, REZERVACIJA.tipplacanja, RECENZIJA.ocjena, RECENZIJA.opis, p1.lokacija AS lokacijaostavljanja, p2.lokacija AS lokacijapreuzimanja
                        FROM rezervacija LEFT JOIN recenzija USING (idrezervacija)
                            JOIN vozilo USING (registracija)
                            JOIN POSLOVNICA AS p1 ON (rezervacija.lokacijaostavljanja = p1.idposlovnica)
                            JOIN POSLOVNICA AS p2 ON (rezervacija.lokacijapreuzimanja = p2.idposlovnica)
                    WHERE korisnickoime = '` + user_name + `' AND (status = 'zavrsena')`;
        try {
            const result = await db.query(sql, []);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    //Postoje li aktivne rezervacije
    static async activeExists(user_name) {
        const sql = `SELECT * FROM rezervacija WHERE korisnickoime = '` + user_name + `' AND (status = 'aktivna' OR status = 'neaktivna')`;
        try {
            console.log("Postoje li aktivne rezervacije - upit")
            const result = await db.query(sql, []);
            if(result.rows.length == 0) {
                console.log("false");
                return false;
            } else {
                console.log("true");
                return true;
            }
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    //Postoje li zavrsene rezervacije
    static async doneExists(user_name) {
        const sql = `SELECT * FROM rezervacija WHERE korisnickoime = '` + user_name + `' AND (status = 'zavrsena')`;
        try {
            console.log("Postoje li zavrsene rezervacije - upit")
            const result = await db.query(sql, []);
            if(result.rows.length == 0) {
                console.log("false");
                return false;
            } else {
                console.log("true");
                return true;
            }
        } catch (err) {
            console.log(err);
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
        user.korisnickoime + "', '" + user.ime + "', '" + user.prezime + "', '" +
        user.email + "', '" + user.lozinka + "', '" + user.brojmobitela + "', '" + user.uloga + "') RETURNING korisnickoIme";
    try {
        const result = await db.query(sql, []);
        return result.rows[0].korisnickoime;
    } catch (err) {
        console.log(err);
        throw err
    }
}




