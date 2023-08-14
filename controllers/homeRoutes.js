const router = require('express').Router();
const { User, HighScore } = require('../models');

router.get('/', async (req, res) => {
  try {    
    res.render('gameplay', { loggedIn: req.session.logged_in} );
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.get('/login', async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
    res.render('login', { loggedIn: req.session.logged_in} );
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
    }
});

// Go to profile
router.get('/profile', async (req, res) => {
  try {
    if (!req.session.logged_in) {
      res.redirect('/login');
      return;
    }
      const highscoreData = await HighScore.findAll({order: [['score', 'DESC']], where: {user_id: req.session.user_id }});
      console.log(highscoreData);

      const highScores = highscoreData.map((score) => score.get({ plain: true })); 


      console.log(highScores)
      res.render('profile', { highScores, loggedIn: req.session.logged_in});    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;