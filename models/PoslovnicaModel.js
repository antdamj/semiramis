const db = require('../db')

module.exports = class Poslovnica {
   constructor(idposlovnica, lokacija) {
      this.idposlovnica = idposlovnica
      this.lokacija = lokacija
   }
}