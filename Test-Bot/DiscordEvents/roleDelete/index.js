const { MessageEmbed } = require('discord.js');
const { Guilds } = require('../../dbObjects');

module.exports = {
	run: async (role) => {
		const guildObject = await Guilds.findOne({ where: { guild_id: role.guild.id } })
		const channelLogs = role.guild.channels.cache.get(guildObject.logs_id)
		if(!channelLogs) return
		if(role.id === guildObject.support_id) {
			let roleDelete_embed = new MessageEmbed()
			.setAuthor(`${role.name}(${role.id})`)
			.setDescription(
				`Support role has been deleted,\n• Name: ${role.name}\n• Created: \`${role.createdAt.toLocaleString()}\`\n• Color: ${role.hexColor}`
			)
			.setTimestamp()
			.setFooter('Role deleted')
			.setColor('0099ff');
			Guilds.upsert({ guild_id: role.guild.id, support_id: ''})
		return channelLogs.send(roleDelete_embed);
		}
		if(role.id === guildObject.muterole_id) {
			let roleDelete_embed = new MessageEmbed()
			.setAuthor(`${role.name}(${role.id})`)
			.setDescription(
				`Muted role has been deleted,\n• Name: ${role.name}\n• Created: \`${role.createdAt.toLocaleString()}\`\n• Color: ${role.hexColor}`
			)
			.setTimestamp()
			.setFooter('Role deleted')
			.setColor('0099ff');
			Guilds.upsert({ guild_id: role.guild.id, muterole_id: ''})
		return channelLogs.send(roleDelete_embed);
		}
		let roleDelete_embed = new MessageEmbed()
		.setAuthor(`${role.name}(${role.id})`)
		.setDescription(
				`• Name: ${role.name}\n• Created: \`${role.createdAt.toLocaleString()}\`\n• Color: ${role.hexColor}`
			)
			.setTimestamp()
			.setFooter('Role deleted')
			.setColor('0099ff');
		channelLogs.send(roleDelete_embed);
	

  }
}