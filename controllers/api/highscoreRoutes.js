const router = require('express').Router();
const { HighScore } = require('../../models');

// POST request to submit a highscore
router.post('/', async (req, res) => {
    try {
        const highScoreData = await HighScore.create(req.body);
        res.status(200).json(highScoreData);
    } catch (err){
        res.status(400).json(err);
    }
});

// GET request to receive a user's highscores
router.get('/:id', async (req, res) => {
    try{
        const highScoreData = HighScore.findAll({
            where: {user_id: req.params.id}
        });
        res.status(200).json(highScoreData);
    }catch(err) {
        res.status(400).json(err);
    }
});

module.exports = router;