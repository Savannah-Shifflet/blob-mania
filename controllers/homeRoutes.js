const router = require('express').Router();
const { User, HighScores } = require('../models');

router.get('/', async (req, res) => {
  try { 
    if (req.session.logged_in) {
    const userData = await User.findByPk(req.session.user_id);
    const user = userData.get({ plain:true });
    console.log(userData);
    console.log(user);
    res.render('gameplay', { user, loggedIn: req.session.logged_in} );
    console.log(req.session.user_id)
  } else {
    res.render('gameplay')
  }
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
      const highscoreData = await HighScores.findAll({order: [['score', 'DESC']], where: {user_id: req.session.user_id }});
      console.log(highscoreData);

      const highScores = highscoreData.map((score) => score.get({ plain: true })); 

      const totalScoreData = await HighScores.sum('score', {where: {user_id: req.session.user_id }});
      console.log(totalScoreData);

      res.render('profile', { highScores, totalScoreData, loggedIn: req.session.logged_in});    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;