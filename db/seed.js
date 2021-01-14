const {
    Pool
} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'autos',
    password: 'bazepodataka',
    port: 5432,
});

// KORISNIK // KORISNIK //

const sql_create_korisnik = `CREATE TABLE korisnik
(
    korisnickoIme   text PRIMARY KEY UNIQUE,
	ime			    text NOT NULL,
	prezime		    text NOT NULL,
    email		    text NOT NULL,
    lozinka		    text NOT NULL,
	brojMobitela	text NOT NULL,
	uloga		    text
)`;

const sql_insert_korisnik = `INSERT INTO korisnik 
(korisnickoIme, ime, prezime, email, lozinka, brojMobitela, uloga) VALUES 
    ('admin', 'Josip', 'Hrvatić', 'josip.hrvatic@fer.hr', 'f865b53623b121fd34ee5426c792e5c33af8c227', '0996753456', 'admin'),
    ('toni', 'Antonio', 'Damjanović', 'antonio.damjanovic@fer.hr', '957c6ab90fbe71ad6387b3f34c5ff37bee1179e7', '0916729911', 'vlasnik'),
    ('kreso', 'Krešimir', 'Blaić', 'kresimir.blaic@fer.hr', '62f2a6f1ff2cdeff37ed7c0267d6aa75ce2cd31a', '0956723334', 'korisnik'),
    ('megi', 'Magda', 'Smolić - Ročak', 'magda.smolic-rocak@fer.hr', 'd8ee18d8e3a8061cfee6f38ba62aee7bb2402a55', '0919241827', 'korisnik'),
    ('petra', 'Petra', 'Mandić', 'petra.mandic@fer.hr', '6f258cb8a53476b51daaef17fb259d5c2dddcdad', '0927894563', 'korisnik'),
    ('marta', 'Marta', 'Karlović', 'marta.karlovic@fer.hr', '206e829f136ced612e6cebe7890bb1771407eb7c', '0997845123', 'korisnik'),
    ('matej', 'Matej', 'Ivanković', 'matej.ivankovic@fer.hr', '2f8547d60d41c3c61e8d10c10860e29c6c792cf6', '0914567892', 'korisnik'),
    ('marko', 'Marko', 'Bošnjak', 'marko.bosnjak@gmail.com', 'c9aa572d1b9f64f146b5e098acfed98a530ae8d0', '0984561237', 'korisnik')`;

const sql_create_korisnik_korisnickoIme_index = `CREATE INDEX idx_korisnickoIme ON korisnik(korisnickoIme)`;

// VOZILO // VOZILO //

const sql_create_vozilo = `CREATE TABLE vozilo
(
    registracija text PRIMARY KEY UNIQUE,
	marka		 text NOT NULL,
	model		 text NOT NULL,
	kategorija	 text NOT NULL,
    cijenaDan	 numeric NOT NULL,
    slikaURL     text NOT NULL
)`;

const sql_insert_vozilo = `INSERT INTO vozilo
(registracija, marka, model, kategorija, cijenaDan, slikaURL) VALUES 
    ('ZG139JH', 'Renault', 'Clio', 'niža', 169, 'https://cdn.euroncap.com/media/57972/renault-clio.png?mode=crop&width=359&height=235'),
    ('BJ467BB', 'Opel', 'Astra', 'niža', 70, 'https://www.bonorentacar.com/wp-content/uploads/car-rental-gallery/1460994384_144905726316505.jpeg'),
    
    ('ST558BF', 'Škoda', 'Octavia', 'srednja', 329, 'https://ip.index.hr/remote/indexnew.s3.index.hr/c7a7b3b8-1eee-4834-b68d-d92095d1fc8b-Soctavia0.jpg' ),
    ('RI812HT', 'Volkswagen', 'Passat', 'srednja', 359, 'https://static.jutarnji.hr/images/live-multimedia/binary/2019/2/6/13/cb276ac6-2019-vw-passat-facelift-8.jpg'),

    ('DU567OG', 'Audi', 'A6', 'viša', 999, 'https://autogaraza.hr/wp-content/uploads/Audi-A6-Saloon-Black-Edition_1.jpg'),
    ('ZD674UT', 'Mercedes', 'V klasa', 'viša', 949, 'https://autostart.24sata.hr/media/img/e9/7d/d55391e744fc9814c14d.jpeg');`;

// RECENZIJA // RECENZIJA //

const sql_create_recenzija = `CREATE TABLE recenzija (
	idRezervacija		int PRIMARY KEY UNIQUE,
	ocjena			int,
	opis			   text,
	CHECK (ocjena BETWEEN 1 AND 5) 
);`

const sql_insert_recenzija = ` INSERT into recenzija VALUES 
    (1, 1, 'loša usluga'),
    (3, 2, 'dovoljno dobro'),
    (4, 3, 'dobro'),
    (6, 4, 'vrlo dobro'),
    (7, 5, 'odlična usluga!'),
    (8, 5, 'odlična usluga!'),
    (9, 1, 'loša usluga'),
    (10, 3, 'dobro'),
    (11, 5, 'odlična usluga!'),
    (13, 2, 'dovoljno dobro'),
    (14, 5, 'odlična usluga!'),
    (15, 4, 'vrlo dobro'),
    (17, 3, 'dobro'),
    (19,5, 'odlična usluga!'),
    (21, 2, 'dovoljno dobro'),
    (24, 4, 'vrlo dobro')`

const sql_create_recenzija_index = `CREATE INDEX korisnickoIme_recenzija ON recenzija(korisnickoIme)`;

// REZERVACIJA // REZERVACIJA //

const sql_create_rezervacija = `CREATE TABLE rezervacija
(
    idRezervacija	   	int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	vrijemeRezervacije 	TIMESTAMP,
	vrijemePreuzimanja 	TIMESTAMP,
	vrijemeZavrsetka   	TIMESTAMP,
	lokacijaPreuzimanja int NOT NULL,
	lokacijaOstavljanja	int NOT NULL,
	korisnickoIme		text NOT NULL,
	registracija    	text NOT NULL,
    status				text NOT NULL,
    tipPlacanja         text NOT NULL
)`;
const sql_insert_rezervacija = `INSERT INTO rezervacija
    (vrijemeRezervacije, vrijemePreuzimanja, vrijemeZavrsetka, lokacijaPreuzimanja, lokacijaOstavljanja, korisnickoIme, registracija, status, tipPlacanja)
    VALUES
    ('2020-10-1 00:00:05', '2020-10-2 00:00:05', '2020-10-6 00:00:05', '1', '2', 'kreso', 'ZG139JH', 'zavrsena', 'card'),
    ('2020-10-3 00:00:05', '2020-10-3 00:00:05', '2020-10-7 00:00:05', '2', '2', 'megi', 'DU567OG', 'zavrsena', 'cash'),
    ('2020-10-5 00:00:05', '2020-10-6 00:00:05', '2020-10-10 00:00:05', '3', '3', 'petra', 'ST558BF', 'zavrsena', 'card'),
    ('2020-10-7 00:00:05', '2020-10-8 00:00:05', '2020-10-11 00:00:05', '4', '5', 'marta', 'BJ467BB', 'zavrsena', 'cash'),
    ('2020-10-11 00:00:05', '2020-10-11 00:00:05', '2020-10-15 00:00:05', '6', '6', 'matej', 'ZG139JH', 'zavrsena', 'card'),
    ('2020-10-13 00:00:05', '2020-10-14 00:00:05', '2020-10-17 00:00:05', '7', '7', 'marko', 'DU567OG', 'zavrsena', 'cash'),
    ('2020-10-17 00:00:05', '2020-10-17 00:00:05', '2020-10-21 00:00:05', '1', '2', 'megi', 'ZG139JH', 'zavrsena', 'card'),
    ('2020-10-19 00:00:05', '2020-10-20 00:00:05', '2020-10-25 00:00:05', '3', '4', 'kreso', 'ST558BF', 'zavrsena', 'cash'),
    ('2020-10-23 00:00:05', '2020-10-24 00:00:05', '2020-10-27 00:00:05', '4', '5', 'petra', 'BJ467BB', 'zavrsena', 'card'),
    ('2020-11-1 00:00:05', '2020-11-2 00:00:05', '2020-11-5 00:00:05', '6', '7', 'marko', 'RI812HT', 'zavrsena', 'cash'),
    ('2020-11-3 00:00:05', '2020-11-4 00:00:05', '2020-11-7 00:00:05', '2', '6', 'megi', 'ZD674UT', 'zavrsena', 'card'),
    ('2020-11-5 00:00:05', '2020-11-6 00:00:05', '2020-11-9 00:00:05', '7', '1', 'marta', 'BJ467BB', 'zavrsena', 'cash'),
    ('2020-11-7 00:00:05', '2020-11-8 00:00:05', '2020-11-14 00:00:05', '5', '5', 'megi', 'ZG139JH', 'zavrsena', 'card'),
    ('2020-11-11 00:00:05', '2020-11-12 00:00:05', '2020-11-17 00:00:05', '6', '2', 'matej', 'ZG139JH', 'zavrsena', 'cash'),
    ('2020-11-13 00:00:05', '2020-11-14 00:00:05', '2020-11-19 00:00:05', '4', '2', 'kreso', 'BJ467BB', 'zavrsena', 'card'),
    ('2020-11-17 00:00:05', '2020-11-20 00:00:05', '2020-11-27 00:00:05', '3', '4', 'petra', 'RI812HT', 'zavrsena', 'cash'),
    ('2020-11-19 00:00:05', '2020-11-20 00:00:05', '2020-11-27 00:00:05', '3', '1', 'marta', 'ZG139JH', 'zavrsena', 'card'),
    ('2020-11-23 00:00:05', '2020-11-24 00:00:05', '2020-11-27 00:00:05', '2', '5', 'marko', 'ST558BF', 'zavrsena', 'cash'),
    ('2020-11-29 00:00:05', '2020-11-30 00:00:05', '2020-12-7 00:00:05', '3', '2', 'matej', 'BJ467BB', 'zavrsena', 'card'),
    ('2020-12-1 00:00:05', '2020-12-2 00:00:05', '2020-12-7 00:00:05', '2', '1', 'petra', 'ZG139JH', 'zavrsena', 'cash'),
    ('2020-12-2 00:00:05', '2020-12-2 00:00:05', '2020-12-7 00:00:05', '1', '3', 'kreso', 'ZG139JH', 'zavrsena', 'card'),
    ('2020-12-3 00:00:05', '2020-12-5 00:00:05', '2020-12-9 00:00:05', '3', '5', 'marta', 'BJ467BB', 'zavrsena', 'cash'),
    ('2020-12-5 00:00:05', '2020-12-6 00:00:05', '2020-12-11 00:00:05', '1', '1', 'megi', 'ZG139JH', 'zavrsena', 'card'),
    ('2020-12-7 00:00:05', '2020-12-8 00:00:05', '2020-12-14 00:00:05', '2', '2', 'matej', 'DU567OG', 'zavrsena', 'cash'),
    ('2020-12-11 00:00:05', '2020-12-11 00:00:05', '2020-12-16 00:00:05', '3', '3', 'kreso', 'ZG139JH', 'zavrsena', 'card'),
    ('2020-12-13 00:00:05', '2020-12-13 00:00:05', '2020-12-17 00:00:05', '3', '5', 'petra', 'BJ467BB', 'zavrsena', 'cash'),
    ('2020-12-17 00:00:05', '2020-12-20 00:00:05', '2020-12-24 00:00:05', '6', '4', 'marta', 'ZD674UT', 'zavrsena', 'card'),
    ('2020-12-19 00:00:05', '2020-12-21 00:00:05', '2020-12-28 00:00:05', '1', '8', 'marko', 'BJ467BB', 'zavrsena', 'cash'),
    ('2020-12-23 00:00:05', '2020-12-23 00:00:05', '2020-12-28 00:00:05', '1', '4', 'matej', 'RI812HT', 'zavrsena', 'card'),
    ('2020-12-29 00:00:05', '2020-12-30 00:00:05', '2021-1-5 00:00:05', '4', '5', 'petra', 'BJ467BB', 'zavrsena', 'cash'),
    ('2020-12-31 00:00:05', '2020-12-31 00:00:05', '2021-1-7 00:00:05', '2', '7', 'kreso', 'ST558BF', 'zavrsena', 'card'),
    ('2021-1-1 00:00:05', '2021-1-2 00:00:05', '2021-1-6 19:00:05', '8', '8', 'megi', 'ZG139JH', 'neaktivna', 'cash'),
    ('2021-1-2 14:00:06', '2021-1-11 00:00:05', '2021-1-21 19:00:05', '9', '1', 'kreso', 'BJ467BB', 'aktivna', 'kartica'),
    ('2021-1-3 13:00:07', '2021-1-10 00:00:05', '2021-1-25 19:00:05', '4', '4', 'megi', 'ST558BF', 'aktivna', 'cash'),
    ('2021-1-4 12:00:08', '2021-1-5 00:00:05', '2021-1-9 19:00:05', '2', '5', 'megi', 'RI812HT', 'zavrsena', 'kartica'),
    ('2021-1-5 11:00:09', '2021-1-6 00:00:05', '2021-1-10 19:00:05', '5', '6', 'kreso', 'ZD674UT', 'zavrsena', 'cash')
    `;
const sql_create_rezervacija_korisnickoIme_index = `CREATE INDEX idx_reservationId ON rezervacija(idRezervacija)`;

// SESSION // SESSION //

const sql_create_session = `CREATE TABLE session (
    sid varchar NOT NULL COLLATE "default",
    sess json NOT NULL,
    expire timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);`

const sql_create_session_index1 = `ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE`
const sql_create_session_index2 = `CREATE INDEX IDX_session_expire ON session(expire)`

// POSLOVNICA // POSLOVNICA //

const sql_create_poslovnica = ` CREATE TABLE poslovnica (
    idPoslovnica    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lokacija        text NOT NULL,
    brojTelefona    text NOT NULL
);`

const sql_insert_poslovnica = `INSERT INTO poslovnica 
    (lokacija, brojTelefona) VALUES 
    ('Zadarska ulica 51', '013954617'),
	('Unska ulica 3', '017691348'),
	('Kaptol ulica 30', '013671966'),
	('Nova cesta 73', '013617624'),
	('Trg Josipa Jurja Strossmayera 3', '012395714'),
    ('Kalčićeva ulica 2', '014976228'),
	('Jarunska ulica 2', '019697216'),
	('Maksimirska 132', '016831973'),
    ('Lučko 5', '019736618'),
    ('Hercegovačka ulica 11', '039705249');`;

//noconst sql_insert_rezervacija = ';';
const sql_insert_session = ';';

const sql_create_poslovnica_index = `CREATE INDEX idx_idPoslovnica ON poslovnica(idPoslovnica)`;

// // //

let table_names = [
    'korisnik',
    'vozilo',
    'recenzija',
    'rezervacija',
    'session',
    'poslovnica'
];

let tables = [
    sql_create_korisnik,
    sql_create_vozilo,
    sql_create_recenzija,
    sql_create_rezervacija,
    sql_create_session,
    sql_create_poslovnica
];

let table_data = [
    sql_insert_korisnik,
    sql_insert_vozilo,
    sql_insert_recenzija,
    sql_insert_rezervacija,
    sql_insert_session,
    sql_insert_poslovnica
];

let indexes = [
    sql_create_korisnik_korisnickoIme_index,
    sql_create_recenzija_index,
    sql_create_rezervacija_korisnickoIme_index,
    sql_create_session_index1,
    sql_create_session_index2,
    sql_create_poslovnica_index
];

(async () => {
    console.log('Creating and populating tables');
    for (let i = 0; i < tables.length; i++) {
        console.log('Creating table ' + table_names[i] + '.');
        try {
            await pool.query(tables[i], []);
            console.log('Table ' + table_names[i] + ' created.');
            if (table_data[i] !== undefined) {
                try {
                    await pool.query(table_data[i], []);
                    console.log('Table ' + table_names[i] + ' populated with data.');
                } catch (err) {
                    console.log('Error populating table ' + table_names[i] + ' with data.');
                    return console.log(err.message);
                }
            }
        } catch (err) {
            console.log('Error creating table ' + table_names[i]);
            return console.log(err.message);
        }
    }

    console.log('Creating indexes');
    for (let i = 0; i < indexes.length; i++) {
        try {
            await pool.query(indexes[i], []);
            console.log('Index ' + i + ' created.');
        } catch (err) {
            console.log('Error creating index ' + i + '.');
        }
    }
})();