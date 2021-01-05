const db = require('../db')

module.exports = class Administrator extends User {
    constructor(user_name, first_name, last_name, email, password, phoneNumber, role = "administrator") {
        this.korisnickoime = user_name
        this.ime = first_name
        this.prezime = last_name
        this.email = email
        this.lozinka = password
        this.brojmobitela = phoneNumber
        this.uloga = role
    }

    getByRole = async (user_role) => {
        const sql = `select * from korisnik where uloga = '` + user_role + `'`
        try {
            const result = await db.query(sql, [])
            return result.rows
        } catch (e) {
            console.log(e)
            throw e
        }
    };

    removeUser = async (user_name) => {
        const sql = `delete from korisnik where korisnickoIme = '` + user_name + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    };

    giveOwnerToUser = async (user_name) => {
        const sql = `update korisnik set uloga = 'vlasnik' where korisnickoIme = '` + user_name + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    addLocation = async (adress) => {
        const sql = `insert into poslovnica (lokacija) values ('` + adress + `')`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    removeLocation = async (id) => {
        const sql = `delete from poslovnica where idPoslovnica = '` + id + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    editLocation = async (id, location) => {
        const sql = `update poslovnica set lokacija = '` + location + `' where idPoslovnica = '` + id + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    getReviews = async () => {
        const sql = `select * from recenzija`
        try {
            const result = await db.query(sql, [])
            return result.rows
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}