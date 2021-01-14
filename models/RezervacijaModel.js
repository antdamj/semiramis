const db = require('../db')

module.exports = class Rezervacija {
   constructor(idrezervacija, vrijemerezervacije, vrijemepreuzimanja, 
      vrijemezavrsetka, lokacijapreuzimanja, lokacijaostavljanja, korisnickoime, registracija, status) {
         this.idrezervacija = idrezervacija
         this.vrijemerezervacije = vrijemerezervacije
         this.vrijemepreuzimanja = vrijemepreuzimanja
         this.vrijemezavrsetka = vrijemezavrsetka
         this.lokacijapreuzimanja = lokacijapreuzimanja
         this.lokacijaostavljanja = lokacijaostavljanja
         this.korisnickoime = korisnickoime
         this.registracija = registracija
         this.status = status
      }
}

/*STATUS moze biti definiran kao:
   status = aktivna
   status = zavrsena
*/
