const User = require('./User');
const HighScores = require('./HighScores')

User.hasMany(HighScores, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

HighScores.belongsTo(User, {
    foreignKey: 'user_id'
})

module.exports = { User, HighScores };
