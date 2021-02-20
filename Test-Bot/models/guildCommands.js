module.exports = (sequelize, DataTypes) => {
	return sequelize.define('guild_commands', {
        command_name: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		guild_id: {
			type: DataTypes.STRING,
		},
        text: {
            type: DataTypes.TEXT,
        },
	});
};