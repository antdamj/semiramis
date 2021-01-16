const db = require('../db')
const User = require('../models/UserModel')

module.exports = class Administrator extends User {
    constructor(user_name, first_name, last_name, email, password, phoneNumber, role = "admin") {
        this.korisnickoime = user_name
        this.ime = first_name
        this.prezime = last_name
        this.email = email
        this.lozinka = password
        this.brojmobitela = phoneNumber
        this.uloga = role
    }

    static getUsers = async () => {
        const sql = `select * from korisnik`
        try {
            const result = await db.query(sql, [])
            return result
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static getByRole = async (user_role) => {
        const sql = `select * from korisnik where uloga = '` + user_role + `'`
        console.log("HI " + sql);
        try {
            const result = await db.query(sql)
            return result;
        } catch (e) {
            console.log(e)
            throw e
        }
    };

    static removeUser = async (user_name) => {
        const sql = `delete from korisnik where korisnickoIme = '` + user_name + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    };

    static giveOwnerToUser = async (user_name) => {
        const sql = `update korisnik set uloga = 'vlasnik' where korisnickoIme = '` + user_name + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static getLocations = async () => {
        const sql = `select * from poslovnica`
        try {
            const result = await db.query(sql)
            return result
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static addLocation = async (adress, callerNo) => {
        const sql = `insert into poslovnica (lokacija, brojTelefona) values ('` + adress + `', '` + callerNo + `');`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static removeLocation = async (id) => {
        const sql = `delete from poslovnica where idPoslovnica = '` + id + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static editLocationLocation = async (id, location) => {
        const sql = `update poslovnica set lokacija = '` + location + `' where idPoslovnica = '` + id + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static editLocationNumber = async (id, callerNo) => {
        const sql = `update poslovnica set brojTelefona = '` + callerNo + `' where idPoslovnica = '` + id + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static getReviews = async () => {
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