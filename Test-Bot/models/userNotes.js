module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_notes', {
    note_number: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.STRING,
		},
		executor_id: {
			type: DataTypes.STRING,
		},
    text: {
      type: DataTypes.TEXT,
    },
	});
};