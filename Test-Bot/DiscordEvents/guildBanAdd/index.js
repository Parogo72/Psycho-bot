const { MessageEmbed } = require('discord.js');
const { Guilds } = require('../../dbObjects');

module.exports = {
	run: async (guild, user) => {
		const guildObject = await Guilds.findOne({ where: { guild_id: guild.id } })
		const channelLogs = guild.channels.cache.get(guildObject.modlogs_id)
	let bans = await guild.fetchAuditLogs({
		type: 22,
	})
	let executor = bans.entries.first().executor
	let reason = bans.entries.first().reason || 'There was no reason provided'
	if(executor.bot || !channelLogs) return;
	

	let newBan_embed = new MessageEmbed()
		.setAuthor(`${user.tag}(${user.id})`, user.avatarURL())
		.setThumbnail(user.displayAvatarURL())
		.setTimestamp()
		.setDescription(
			`• Profile: ${user}\n• Created: \`${user.user.createdAt.toLocaleString()}\`\n• Moderator: ${executor}\n• Reason: \`${reason}\``
		)
		.setFooter('User banned')
		.setColor('3399ff');
	channelLogs.send(newBan_embed);
	}
}