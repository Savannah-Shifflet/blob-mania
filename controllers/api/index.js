const router = require('express').Router();
const userRoutes = require('./userRoutes');
const highscoreRoutes = require('./highscoreRoutes');

router.use('/users', userRoutes);
router.use('/highscore', highscoreRoutes);

module.exports = router;