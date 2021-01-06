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



    static addVehicle = async (vozilo) => {
        const sql = `insert into vozilo (registracija, marka, model, kategorija, cijenadan, slikaurl) 
        values ('` + vozilo.registracija + `', '` + vozilo.marka + `', '` + vozilo.model + `', '` + vozilo.kategorija + `', '` + vozilo.cijenadan + `', '` + vozilo.slikaurl + `',)`
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
    static editVozilo = async (vozilo) => {
        const sql = `update vozilo set kategorija = '` + vozilo.kategorija + `', cijenadan = '` + vozilo.cijenadan + `', slikaurl = '` + vozilo.slikaurl + `'
        where registracija = '` + vozilo.registracija + `'`
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
        const sql = `select * from rezervacija where status = aktivna`
        try {
            const result = await db.query(sql, [])
            return result.rows
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    static closeReservation = async (idrezervacija) => {
        const sql = `update rezervacija set status = zavrsena
        where idrezervacija = '` + idrezervacija + `'`
        try {
            const result = await db.query(sql, [])
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    static getAvailableVehicles = async () => {
        const sql = `select distinct vozilo.* 
        from vozilo left join rezervacija where status <> aktivna`
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