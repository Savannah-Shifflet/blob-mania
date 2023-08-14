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


// Worked before but now broken. Something with a session...(saved a copy here for now)
// const router = require('express').Router();
// const { User } = require('../models');

// router.get('/', async (req, res) => {
//   try {
//     // Get all users, sorted by name
//     // const userData = await User.findAll({
//     //   attributes: { exclude: ['password'] },
//     //   order: [['name', 'ASC']],
//     // });

//     // Serialize user data so templates can read it
//     // const users = userData.map((project) => project.get({ plain: true }));

//     // Pass serialized data into Handlebars.js template
//     // res.render('gameplay', { users });
    
//     res.render('gameplay',);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Goes to login (if not logged on)
// router.get('/login', async (req, res) => {
//   try {
//       if (req.session.logged_in) {
//           res.redirect('/');
//           return;
//       }
//       res.render('login');
//   } catch (err) {
//       console.log(err);
//       res.status(500).json(err);
//   }
// });

// router.get('/login', (req, res) => {
//   // If the user is already logged in, redirect the request to another route
//   if (req.session.logged_in) {
//     res.redirect('/profile');
//     return;
//   }

//   res.render('login');
// });

// module.exports = router;
