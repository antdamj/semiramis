const db = require('../db')

module.exports = class Recenzija {
   constructor(idrezervacija, ocjena, opis, korisnickoime) {
      this.idrezervacija = idrezervacija
      this.ocjena = ocjena
      this.opis = opis
      this.korisnickoime = korisnickoime
   }
}