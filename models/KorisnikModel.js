const db = require('../db')

module.exports = class Korisnik extends User {

    constructor(user_name, first_name, last_name, email, password, phoneNumber, role = "korisnik") {
        this.korisnickoime = user_name
        this.ime = first_name
        this.prezime = last_name
        this.email = email
        this.lozinka = password
        this.brojmobitela = phoneNumber
        this.uloga = role
        let rezervacija = new Set()
        let recenzija = new Set()
    }

    //nisam sig jel ovo treba
    static async fetchKorisnik() {

        let ime = this.ime
        let results = await dbGetUserByName(ime)
        console.log(results);

        return results
    }

    // u formi na route imamo samo mijenjanje sifre, lagano izbacimo neki dio ako mislite da nesto korisnik nebi smio mijenjat
    updateInformation = async(user_name, ime, prezime, email, lozinka, brojmobitela) => {

        let results = await dbGetUserByName(user_name)
        console.log(results)

        if(results.length > 0){
            
            if(ime !== undefined) {
                const sql = `update korisnik set ime = '` + ime + `' where korisnickoIme = '` + user_name + `'`
                try {
                    const result = await db.query(sql, [])
                } catch (e) {
                    console.log(e)
                    throw e
                }
            }

            if(prezime !== undefined) {
                const sql = `update korisnik set prezime = '` + prezime + `' where korisnickoIme = '` + user_name + `'`
                try {
                    const result = await db.query(sql, [])
                } catch (e) {
                    console.log(e)
                    throw e
                }
            }

            if(email !== undefined) {
                const sql = `update korisnik set email = '` + email + `' where korisnickoIme = '` + user_name + `'`
                try {
                    const result = await db.query(sql, [])
                } catch (e) {
                    console.log(e)
                    throw e
                }
            }

            if(lozinka !== undefined) {
                const sql = `update korisnik set lozinka = '` + lozinka + `' where korisnickoIme = '` + user_name + `'`
                try {
                    const result = await db.query(sql, [])
                } catch (e) {
                    console.log(e)
                    throw e
                }
            }

            if(brojmobitela !== undefined) {
                const sql = `update korisnik set brojMobitela = '` + brojmobitela + `' where korisnickoIme = '` + user_name + `'`
                try {
                    const result = await db.query(sql, [])
                } catch (e) {
                    console.log(e)
                    throw e
                }
            }
        }
    }

    getReservations = async () => {

        let user_name = this.ime
        const sql = `select * from rezervacija where korisnickoIme = '` + user_name + `'`

        try {
            const results = await db.query(sql, [])
            rezervacija = results.rows    //nez cemu sluzi ovaj collection al ajde
            return results.rows
        }catch (e){
            console.log(e)
            throw e
        }
    }

    deleteUser = async () => {

        let user_name = this.ime
        const sql = `delete from korisnik where korisnickoIme = '` + user_name + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    rateService = async (idReservation, grade, review) => {

        const sql = `insert into recenzija values ( ` + idReservation + ` , ` + grade + ` , ` + `'` + review + `' , ` + `'` + this.korisnickoime + `')`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    getVehicles = async (kategorija) => {

        const sql = `select * from vozilo where kategorija = '` + kategorija + `'`
        try {
            const result = await db.query(sql, [])
            return result.rows
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}    