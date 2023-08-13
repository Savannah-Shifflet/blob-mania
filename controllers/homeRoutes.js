const router = require('express').Router();
const { User } = require('../models');

router.get('/', async (req, res) => {
  try {
    // Get all users, sorted by name
    // const userData = await User.findAll({
    //   attributes: { exclude: ['password'] },
    //   order: [['name', 'ASC']],
    // });

    // Serialize user data so templates can read it
    // const users = userData.map((project) => project.get({ plain: true }));

    // Pass serialized data into Handlebars.js template
    // res.render('gameplay', { users });
    
    res.render('gameplay',);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Login
router.get('/login', async (req, res) => {
  try {
    res.render('login', );
  } catch (err) {
    res.status(500).json(err);
  }
});

// Go to profile
router.get('/profile', async (req, res) => {
  try {
    res.render('profile', );
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
