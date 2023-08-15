const sequelize = require('../config/connection');
const { User, HighScores } = require('../models');

const userData = require('./userData.json');
const highScoreData = require('./highScoreData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await HighScores.bulkCreate(highScoreData, {
    individualHooks: true,
    returning: true,
  })

  process.exit(0);
};

seedDatabase();
