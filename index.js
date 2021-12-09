const express = require('express');
const morgan = require('morgan');
const { Prohairesis } = require('prohairesis');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const mySQLString = process.env.CLEARDB_DATABASE_URL;
const database = new Prohairesis(mySQLString);

app
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())

    .get('/foglalasok', async (req, res) => {
        const foglalasok = await database.query("SELECT * FROM foglalasok");

        res.contentType('html');

        res.end(`
            ${foglalasok.map((foglalas) => {
                return `<p>${foglalas.vezetekNev} ${foglalas.keresztNev} foglalása: ${foglalas.szolgaltato} - ${foglalas.szolgaltatas} - ${foglalas.datum}</p>`;
            }).join('')}
        `)
    })

    .post('/api/foglalas', async (req, res) => {       
        try {
            await database.execute(`
                INSERT INTO foglalasok (
                    vezetekNev,
                    keresztNev,
                    datum,
                    szolgaltatas,
                    szolgaltato
                ) VALUES (
                    @vezetekNev,
                    @keresztNev,
                    @datum,
                    @szolgaltatas,
                    @szolgaltato
                )
            `, {
                vezetekNev: req.body.vezetekNev,
                keresztNev: req.body.keresztNev,
                datum: req.body.datum,
                szolgaltatas: req.body.szolgTipus,
                szolgaltato: req.body.szolgaltato,
            });
            
            res.redirect('/sikeres.html');
        } catch {
            res.redirect('/error.html');
        }
        
        
    })

    .listen(port, () => console.log(`Server listening on port: ${port}`));
