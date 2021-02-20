const { MessageEmbed } = require('discord.js');
const { Guilds } = require('../../dbObjects');

module.exports = {
	run: async (role) => {
		const guildObject = await Guilds.findOne({ where: { guild_id: role.guild.id } })
		const channelLogs = role.guild.channels.cache.get(guildObject.logs_id)
		
		if(!channelLogs) return
    	let roleCreated_embed = new MessageEmbed()
		.setAuthor(`(${role.id})`)
    	.setDescription(
			`• Role: ${role}\n• Created: \`${role.createdAt.toLocaleString()}\``
		)
		.setTimestamp()
		.setFooter('Role created')
		.setColor('0099ff');
	channelLogs.send(roleCreated_embed);

  }
}