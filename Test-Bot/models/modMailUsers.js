module.exports = (sequelize, DataTypes) => {
	return sequelize.define('modmail_users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
	}, {
		timestamps: false,
	});
};