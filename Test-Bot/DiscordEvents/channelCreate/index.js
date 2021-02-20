const { MessageEmbed } = require('discord.js');
const { Guilds } = require('../../dbObjects');

module.exports = {
	run: async (channel) => {
		if(channel.type == 'dm') return;
		const guildObject = await Guilds.findOne({ where: { guild_id: channel.guild.id } })
		const channelLogs = channel.guild.channels.cache.get(guildObject.logs_id)
    	if(!channelLogs) return
    	let channelCreated_embed = new MessageEmbed()
		.setAuthor(`${channel.name}(${channel.id})`)
		.setDescription(
			`• Channel: ${channel}\n• Created: \`${channel.createdAt.toLocaleString()}\`\n• Category: ${channel.parent.name}`
		)
		.setTimestamp()
		.setFooter('Channel created')
		.setColor('3399ff');
	channelLogs.send(channelCreated_embed);

  }
}