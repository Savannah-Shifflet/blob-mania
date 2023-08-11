const router = require('express').Router();
const { Highscore } = require('../../models');

// POST request to submit a highscore
router.post('/', async (req, res) => {
    try {
        const highscoreData = await Highscore.create(req.body);
        res.status(200).json(highscoreData);
    } catch (err){
        res.status(400).json(err);
    }
});
