const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        default: 0,
        required: true
    },
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    };
    
    return Joi.validate(movie, schema);
};

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
module.exports.movieSchema = movieSchema;