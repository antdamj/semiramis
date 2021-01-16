const db = require('../db')
const User = require('../models/UserModel')
/**

 */
module.exports = class Vlasnik extends User {
    constructor(user_name, first_name, last_name, email, password, phoneNumber, role = "vlasnik") {
        this.registracija = user_name
        this.marka = first_name
        this.model = last_name
        this.kategorija = email
        this.cijenadan = password
        this.slikaurl = phoneNumber
        this.uloga = role
    }



    static addVehicle = async (registracija, marka, model, kategorija, cijenadan, slikaurl) => {
        const sql = `insert into vozilo (registracija, marka, model, kategorija, cijenadan, slikaurl) 
        values ('` + registracija + `', '` + marka + `', '` + model + `', '` + kategorija + `', '` + cijenadan + `', '` + slikaurl + `')`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    static removeVehicle = async (registracija) => {
        const sql = `delete from vozilo where registracija = '` + registracija + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    
    static editVoziloCategory = async (registracija, kategorija) => {
        const sql = `update vozilo set kategorija = '` + kategorija + `' where registracija = '` + registracija + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static editVoziloPrice = async (registracija, cijena) => {
        const sql = `update vozilo set cijenadan = '` + cijena + `' where registracija = '` + registracija + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    static editVoziloImg = async (registracija, slikaurl) => {
        const sql = `update vozilo set slikaurl = '` + slikaurl + `' where registracija = '` + registracija + `'`
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
    static getActiveReservations = async () => {
        const sql = `select * from rezervacija where status = 'aktivna'`
        try {
            const result = await db.query(sql, [])
            return result.rows
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    static getAllReservations = async () => {
        const sql = `select * from rezervacija`
        try {
            const result = await db.query(sql, [])
            return result.rows
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    static closeReservation = async (idrezervacija) => {
        const sql = `update rezervacija set status = 'zavrsena'
        where idrezervacija = '` + idrezervacija + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    static getAllVehicles = async () => {
        const sql = `select * from vozilo`
        try {
            const result = await db.query(sql, [])
            return result.rows
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    static getAvailableVehicles = async () => {
        const sql = `select distinct vozilo.* 
        from vozilo left join rezervacija on vozilo.registracija = rezervacija.registracija 
        where status = 'zavrsena' or status is null`
        try {
            const result = await db.query(sql, [])
            return result.rows
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    static getStatistics = async (pocetak, kraj) => {
        const sql = `select sum(extract(day from vrijemerezervacije)*cijenadan)
        from rezervacija join vozilo
        where vrijemepreuzimanja >= '` + pocetak + `' and vrijemezavrsetka <= '` + kraj + `'`
        try {
            const result = await db.query(sql, [])
            return result.rows
        } catch (e) {
            console.log(e)
            throw e
        }
    }

}