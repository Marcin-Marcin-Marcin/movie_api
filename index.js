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

// Get top movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Get movie by title
app.get('/movies/:title', (req, res) => {
  res.send(`Return data for movie titled: ${req.params.title}`);
});

// Get movie by genre
app.get('/movies/genre/:genreName', (req, res) => {
  res.send(`Return description for genre: ${req.params.genreName}`);
});

// Get director info
app.get('/movies/director/:directorName', (req, res) => {
  res.send(`Return info for director: ${req.params.directorName}`);
});

// Create new user
app.post('/users', (req, res) => {
  res.send('New user registered');
});

// Update user info
app.put('/users/:id', (req, res) => {
  res.send(`User with ID ${req.params.id} updated`);
});

// Add to favorites
app.post('/users/:id/movies/:movieID', (req, res) => {
  res.send(`Movie ${req.params.movieID} added to favorites for user ${req.params.id}`);
});

// Remove from favorites
app.delete('/users/:id/movies/:movieID', (req, res) => {
  res.send(`Movie ${req.params.movieID} removed from favorites for user ${req.params.id}`);
});

// Delete user
app.delete('/users/:id', (req, res) => {
  res.send(`User with ID ${req.params.id} deleted`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});