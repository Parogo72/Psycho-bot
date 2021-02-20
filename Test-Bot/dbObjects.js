const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/users')(sequelize, Sequelize.DataTypes);
const Guilds = require('./models/guilds')(sequelize, Sequelize.DataTypes);
const GuildCommands = require('./models/guildCommands')(sequelize, Sequelize.DataTypes);
const UserModlogs = require('./models/userModlogs')(sequelize, Sequelize.DataTypes);
const UserNotes = require('./models/userNotes')(sequelize, Sequelize.DataTypes);
const modMailUsers = require('./models/modMailUsers')(sequelize, Sequelize.DataTypes);
const guildModmail = require('./models/guildModmail')(sequelize, Sequelize.DataTypes);

Users.belongsTo(Guilds, { foreignKey: 'guild_id', as: 'guild' });
UserModlogs.belongsTo(Users, { foreignKey: 'user_id', as: 'userModlogs' });
UserNotes.belongsTo(Users, { foreignKey: 'user_id', as: 'userNotes' });
GuildCommands.belongsTo(Guilds, { foreignKey: 'guild_id', as: 'guildCommands' });
modMailUsers.belongsTo(Users, { foreignKey: 'user_id', as: 'modmailUser'})

// add commands
Guilds.prototype.addCommand = async function(name, text) {

	return GuildCommands.upsert({ command_name: name, guild_id: this.guild_id, text: text });
};
// end commands
// note related

Users.prototype.deleteNotes = async function(number) {

	let logs = await UserNotes.findAll({
		where: { user_id: this.user_id, note_number: {
			[Op.gt]: number,
		 }}
	})
	UserNotes.destroy({ where: { note_number: Number(number) } })
	logs.forEach(n => {
		UserNotes.destroy({ where: { note_number: n.note_number }})
		UserNotes.upsert({ note_number: n.note_number - 1, user_id: this.user_id, executor_id: n.executor_id, text: n.text  } )
	})
	return
};

Users.prototype.editNotes = async function(text) {

	let logs = await UserNotes.findOne({
		where: { user_id: this.user_id, note_number: number }
	})
	return UserNotes.upsert({ text: text })
	
};

Users.prototype.addNotes = async function(note, executor) {

	let logs = await UserNotes.findAll({
		where: { user_id: this.user_id }
	})
	return UserNotes.upsert({ note_number: logs.length + 1, user_id: this.user_id, executor_id: executor.id, text: note });
};

Users.prototype.getNotes = function() {
	return UserNotes.findAll({
		where: { user_id: this.user_id },
		include: ['userNotes'],
	});
};

// end notes
// modlogs related

Users.prototype.addModlogs = async function(executor, type, reason) {
	let logs = await UserModlogs.findAll({
		where: { user_id: this.user_id, mod_type: type }
	})

	return UserModlogs.upsert({ case_number: logs.length + 1, user_id: this.user_id, executor_id: executor.id, mod_type: type, reason: reason });
};

Users.prototype.getModlogs = function(type) {
	return UserModlogs.findAll({
		where: { user_id: this.user_id, mod_type: type },
		include: ['userModlogs'],
	});
};

// modlogs end
// modmail related

Users.prototype.isModMail = async function() {
	return modMailUsers.findAll({
		where: { user_id: this.user_id },
	});
};

Users.prototype.addModMail = async function() {

	return modMailUsers.upsert({  user_id: this.user_id });
};

Users.prototype.removeModMail = async function() {

	return modMailUsers.destroy({ where: {user_id: this.user_id } });
};

Guilds.prototype.getModmail = async function() {
	return guildModmail.findAll({
		where: { guild_id: this.guild_id},
	});
};

Guilds.prototype.addGuildModMail = async function(name) {

	return guildModmail.upsert({ name: name, guild_id: this.guild_id });
};

Guilds.prototype.deleteGuildModMail = async function(name) {

	return guildModmail.destroy({ where: { name: name, guild_id: this.guild_id } });
};
// end modmail
Users.prototype.getGuilds = async function() {
	return Users.findAll({
		where: { user_id: this.user_id},
	});
};

module.exports = { Users, Guilds, UserModlogs, UserNotes, GuildCommands, modMailUsers };
