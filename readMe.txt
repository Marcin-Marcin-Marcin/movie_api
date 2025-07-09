The myFlix project is a RESTful API built with Node.js and MongoDB. API logging with Morgan, data validation with Express.
Authentication is handled using JWT and Passport.

myFlix dependencies: express, mongoose, dotenv, express, cors, morgan, passport, JWT, bcrypt.

myFlix allows users to register and login, access database of movies(that can be browsed by genre, director, title),
select their favorite movies and add them to the list of favorites. If desired users can edit their list of favorites by removing
the movies they previously added.

Endpoints: POST/users, GET/movies, GET/movies/:Title, GET/movies/genre/:genreName, GET/movies/director/:directorName, PUT/users/:Username,
PUT/users/:Username, POST/users/:Username/movies/:MovieID, DELETE/users/:Username/movies/:MovieID