const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('common'));
app.use(express.static('public'));

let topMovies = [
    {
        title: 'Vertigo',
        director: 'Alfred Hitchcock'
    },
    {
        title: 'Dial M for Murder',
        director: 'Alfred Hitchcock'
    },
    {
        title: 'Rope',
        director: 'Alfred Hitchcock'
    },
    {
        title: 'La Ceremonie',
        director: 'Claude Chabrol'
    },
    {
        title: 'Merci pour le Chocolat',
        director: 'Claude Chabrol'
    },
    {
        title: 'Les Masques',
        director: 'Claude Chabrol'
    },
    {
        title: 'All About My Mother',
        director: 'Pedro Almodovar'
    },
    {
        title: 'The Skin I Live In',
        director: 'Pedro Almodovar'
    },
    {
        title: 'Matador',
        director: 'Pedro Almodovar'
    },
    {
        title: 'Faustrecht der Freiheit',
        director: 'Rainer Werner Fassbinder'
    }
];

app.get('/', (req, res) => {
  res.send('Welcome to my Top Movie List!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});