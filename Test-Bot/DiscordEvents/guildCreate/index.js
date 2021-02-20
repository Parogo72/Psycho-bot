
const { Guilds } = require('../../dbObjects');

module.exports = {
	run: async (guild) => {
        Guilds.upsert({ guild_id: guild.id})
    }
}