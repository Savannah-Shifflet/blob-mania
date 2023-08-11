const User = require('./User');
const HighScore = require('./HighScore')

User.hasMany(HighScore, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

HighScore.belongsTo(User, {
    foreignKey: 'user_id'
})

module.exports = { User, HighScore };
