module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_modlogs', {
		case_number: {
			type: DataTypes.STRING,
		},
    user_id: {
			type: DataTypes.STRING,
		},
    executor_id: {
			type: DataTypes.STRING,
		},
    mod_type: {
      type: DataTypes.STRING,
    },
    reason: {
      type: DataTypes.TEXT,
    },
	});
};