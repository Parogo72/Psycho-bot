const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = require('./models/currencyShop')(sequelize, Sequelize.DataTypes);
require('./models/users')(sequelize, Sequelize.DataTypes);
require('./models/guilds')(sequelize, Sequelize.DataTypes);
require('./models/userModlogs')(sequelize, Sequelize.DataTypes);
require('./models/userItems')(sequelize, Sequelize.DataTypes);
require('./models/userNotes')(sequelize, Sequelize.DataTypes);
require('./models/guildCommands')(sequelize, Sequelize.DataTypes);
require('./models/modMailUsers')(sequelize, Sequelize.DataTypes);
require('./models/guildModmail')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);