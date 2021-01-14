const db = require('../db')

module.exports = class Vozilo {
    constructor(registracija, marka, model, kategorija, cijenadan, slikaurl) {
        this.registracija = registracija
        this.marka = marka
        this.model = model
        this.kategorija = kategorija
        this.cijenadan = cijenadan
        this.slikaurl = slikaurl  
    }
    
}

