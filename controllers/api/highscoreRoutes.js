const router = require('express').Router();
const { HighScores } = require('../../models');

// POST request to submit a highscore
router.post('/', async (req, res) => {
    try {
        const highScoreData = await HighScores.create({score: req.body.score, user_id: req.session.user_id});
        res.status(200).json(highScoreData);
    } catch (err){
        res.status(400).json(err);
    }
});

// GET request to receive a user's highscores
router.get('/:id', async (req, res) => {
    try{
        const highScoreData = HighScores.findAll({
            where: {user_id: req.params.id}
        });
        res.status(200).json(highScoreData);
    }catch(err) {
        res.status(400).json(err);
    }
});

module.exports = router;