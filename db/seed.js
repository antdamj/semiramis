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
    ('megi', 'Magda', 'Smolić - Ročak', 'magda.smolic-rocak@fer.hr', 'd8ee18d8e3a8061cfee6f38ba62aee7bb2402a55', '0919241827', 'korisnik')`;

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
	idRezervacija		int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	ocjena			int,
	opis			   text,
	korisnickoIme	text NOT NULL REFERENCES korisnik(korisnickoIme),
	CHECK (ocjena BETWEEN 1 AND 5) 
);`

const sql_create_recenzija_index = `CREATE INDEX korisnickoIme_recenzija ON recenzija(korisnickoIme)`;

// REZERVACIJA // REZERVACIJA //

const sql_create_rezervacija = `CREATE TABLE rezervacija
(
    idRezervacija	   	int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	vrijemeRezervacije 	TIMESTAMP,
	vrijemePreuzimanja 	TIMESTAMP,
	vrijemeZavrsetka   	TIMESTAMP,
	lokacijaPreuzimanja text NOT NULL,
	lokacijaOstavljanja	text NOT NULL,
	korisnickoIme		text NOT NULL,
	registracija    	text NOT NULL,
    status				text NOT NULL,
    tipPlacanja         text NOT NULL,
	FOREIGN KEY (korisnickoIme) REFERENCES korisnik(korisnickoIme),
	FOREIGN KEY (registracija) REFERENCES vozilo(registracija)
)`;
const sql_insert_rezervacija = `INSERT INTO rezervacija
    (vrijemeRezervacije, vrijemePreuzimanja, vrijemeZavrsetka, lokacijaPreuzimanja, lokacijaOstavljanja, korisnickoIme, registracija, status, tipPlacanja)
    VALUES
    ('2021-1-1 00:00:05', '2021-1-2 00:00:05', '2021-1-6 19:00:05', 'Unska ulica 3', 'Unska ulica 3', 'megi', 'ZG139JH', 'neaktivna', 'cash'),
    ('2021-1-2 14:00:06', '2021-1-11 00:00:05', '2021-1-21 19:00:05', 'Kalčićeva ulica 2', 'Unska ulica 3', 'kreso', 'BJ467BB', 'aktivna', 'kartica'),
    ('2021-1-3 13:00:07', '2021-1-10 00:00:05', '2021-1-25 19:00:05', 'Jarunska ulica 2', 'Kalčićeva ulica 2', 'megi', 'ST558BF', 'aktivna', 'cash'),
    ('2021-1-4 12:00:08', '2021-1-5 00:00:05', '2021-1-9 19:00:05', 'Maksimirska 132', 'Maksimirska 132', 'megi', 'RI812HT', 'zavrsena', 'kartica'),
    ('2021-1-5 11:00:09', '2021-1-6 00:00:05', '2021-1-10 19:00:05', 'Unska ulica 3', 'Jarunska ulica 2', 'kreso', 'ZD674UT', 'zavrsena', 'cash')`;
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

const sql_insert_recenzija = ';';
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