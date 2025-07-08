
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());
//Replace the line above with commented code below to give access exclusively to certain origins
/*let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));*/
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

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

// Get top movies - replaced by version compatible with mongoose
/*app.get('/movies', (req, res) => {
  res.json(topMovies);
});*/

// Get movie by genre  - replaced by version compatible with mongoose
/*app.get('/movies/genre/:genreName', (req, res) => {
  res.send(`Return description for genre: ${req.params.genreName}`);
});*/

// Get director info  - replaced by version compatible with mongoose
/*app.get('/movies/director/:directorName', (req, res) => {
  res.send(`Return info for director: ${req.params.directorName}`);
});*/

// Get movie by title  - replaced by version compatible with mongoose
/*app.get('/movies/:title', (req, res) => {
  res.send(`Return data for movie titled: ${req.params.title}`);
});*/

// Create new user - replaced by version compatible with mongoose
/*app.post('/users', (req, res) => {
  res.send('New user registered');
});*/

// Update user info - replaced by version compatible with mongoose
/*app.put('/users/:id', (req, res) => {
  res.send(`User with ID ${req.params.id} updated`);
});*/

// Add to favorites - replaced by version compatible with mongoose
/*app.post('/users/:id/movies/:movieID', (req, res) => {
  res.send(`Movie ${req.params.movieID} added to favorites for user ${req.params.id}`);
});*/

// Remove from favorites  - replaced by version compatible with mongoose
/*app.delete('/users/:id/movies/:movieID', (req, res) => {
  res.send(`Movie ${req.params.movieID} removed from favorites for user ${req.params.id}`);
});*/

// Delete user - replaced by version compatible with mongoose
/*app.delete('/users/:id', (req, res) => {
  res.send(`User with ID ${req.params.id} deleted`);
});*/

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })

});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
}); 

// Ger movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get genre name
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movie) => {
      if (movie) {
        res.json(movie.Genre);
      } else {
        res.status(404).send('Genre not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get director name
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      if (movie) {
        res.json(movie.Director);
      } else {
        res.status(404).send('Director not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Remove from favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});