const { MessageEmbed } = require('discord.js');
const { Guilds } = require('../../dbObjects');

module.exports = {
	run: async (channel) => {
		if(channel.type == 'dm') return;
		const guildObject = await Guilds.findOne({ where: { guild_id: channel.guild.id } })
		const channelLogs = channel.guild.channels.cache.get(guildObject.logs_id)
		if(!channelLogs) return
		if(channel.id === guildObject.modmail_id) {
			let channelDelete_embed = new MessageEmbed()
			.setAuthor(`${channel.name} (${channel.id})`)
			.setDescription(
				`ModMail category has been deleted,\n• Name: ${channel.name}\n• Created: \`${channel.createdAt.toLocaleString()}\``
			)
			.setTimestamp()
			.setFooter('Category deleted')
			.setColor('0099ff');
			Guilds.upsert({ guild_id: channel.guild.id, modmail_id: ''})
		return channelLogs.send(channelDelete_embed);
		}
		if(channel.id === guildObject.modmailogs_id) {
			let channelDelete_embed = new MessageEmbed()
			.setAuthor(`${channel.name} (${channel.id})`)
			.setDescription(
				`ModMail logs channel has been deleted,\n• Name: ${channel.name}\n• Created: \`${channel.createdAt.toLocaleString()}\`\n• Category: ${channel.parent.name}`
			)
			.setTimestamp()
			.setFooter('Channel deleted')
			.setColor('0099ff');
			Guilds.upsert({ guild_id: channel.guild.id, modmaillogs_id: ''})
		return channelLogs.send(channelDelete_embed);
		}
		if(channel.id === guildObject.modlogs_id) {
			let channelDelete_embed = new MessageEmbed()
			.setAuthor(`${channel.name} (${channel.id})`)
			.setDescription(
				`Modlogs channel has been deleted,\n• Name: ${channel.name}\n• Created: \`${channel.createdAt.toLocaleString()}\`\n• Channel: ${channel.parent.name}`
			)
			.setTimestamp()
			.setFooter('Channel deleted')
			.setColor('0099ff');
			Guilds.upsert({ guild_id: channel.guild.id, modlogs_id: ''})
		return channelLogs.send(channelDelete_embed);
		}
		if(channel.id === guildObject.memberlogs_id) {
			let channelDelete_embed = new MessageEmbed()
			.setAuthor(`${channel.name} (${channel.id})`)
			.setDescription(
				`Memberlogs channel has been deleted,\n• Name: ${channel.name}\n• Created: \`${channel.createdAt.toLocaleString()}\`\n• Channel: ${channel.parent.name}`
			)
			.setTimestamp()
			.setFooter('Channel deleted')
			.setColor('0099ff');
			Guilds.upsert({ guild_id: channel.guild.id, memberlogs_id: ''})
		return channelLogs.send(channelDelete_embed);
		}
		if(channel.id === guildObject.logs_id) {
			let channelDelete_embed = new MessageEmbed()
			.setAuthor(`${channel.name} (${channel.id})`)
			.setDescription(
				`Logs channel has been deleted,\n• Name: ${channel.name}\n• Created: \`${channel.createdAt.toLocaleString()}\`\n• Channel: ${channel.parent.name}`
			)
			.setTimestamp()
			.setFooter('Channel deleted')
			.setColor('0099ff');
			Guilds.upsert({ guild_id: channel.guild.id, logs_id: ''})
		return channelLogs.send(channelDelete_embed);
		}
    	let channelDelete_embed = new MessageEmbed()
		.setAuthor(`${channel.name} (${channel.id})`)
		.setDescription(
			`• Name: ${channel.name}\n• Created: \`${channel.createdAt.toLocaleString()}\`\n• Category: ${channel.parent.name}`
		)
		.setTimestamp()
		.setFooter('Channel deleted')
		.setColor('3399ff');
		channelLogs.send(channelDelete_embed);

  }
}