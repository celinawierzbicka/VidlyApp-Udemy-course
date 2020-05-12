const auth = require('../middleware/auth');
const config = require('config');
const jwt  = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt')
const {User, validateUser} = require('../models/user')
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email} );
    if (user) return res.status(400).send("User already registered.");

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['id', 'name', 'email']));
});

router.put('/:id', async (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, { new: true });
    if(!user) return res.status(404).send('The user with the given ID was not found.');
    
    res.send(user);
});

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send('The user with the given ID was not found.');
    
    res.send(user);
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

module.exports = router;