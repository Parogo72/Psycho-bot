module.exports = (sequelize, DataTypes) => {
	return sequelize.define('guilds', {
		guild_id: {
			type: DataTypes.STRING,
      		primaryKey: true,
		},
		logs_id: {
			type: DataTypes.STRING,
		},
		memberlogs_id: {
			type: DataTypes.STRING,
		},
		modlogs_id: {
			type: DataTypes.STRING,
		},
		muterole_id: {
			type: DataTypes.STRING,
		},
		modmail_id: {
			type: DataTypes.STRING,
		},
		modmaillogs_id: {
			type: DataTypes.STRING,
		},
		support_id: {
			type: DataTypes.STRING,
		}
	}, {
		timestamps: false,
	});
};