const auth = require('../middleware/auth');
const {Movie, validateMovie} = require('../models/movie');
const {Genre} = require('../models/genre')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.post('/', auth, async (req, res) => {
    const {error} = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404). send('Invalid genre.');

    const movie = new Movie({
        title: req.body.title, 
        genre: {
            _id: genre._id,
            name: genre.name
        },  
        numberinStock: req.body.numberinStock, 
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    const {error} = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findByIdAndUpdate({id: req.params.id}, {
        title: req.body.title, 
        genre: {
            _id: genre._id,
            name: genre.name
        }, 
        numberinStock: req.body.numberinStock, 
        dailyRentalRate: req.body.dailyRentalRate
    }, {new: true});
    if (!movie) return res.status(404).send('Movie with the given id was not found');

    res.send(movie);
});

router.delete('./:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove({id: req.params.id});
    if (!movie) return res.status(404).send('Movie with the given id was not found');

    res.send(movie);
});

router.get('./:id', async (req, res) => {
    const movie = await Movie.findById({id: req.params.id});
    if (!movie) return res.status(404).send('Movie with the given id was not found');

    res.send(movie);
})

module.exports = router;
