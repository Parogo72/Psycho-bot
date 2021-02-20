module.exports = (sequelize, DataTypes) => {
	return sequelize.define('modmail_object', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		guild_id: {
			type: DataTypes.STRING,
		},
	}, {
		timestamps: false,
	});
};