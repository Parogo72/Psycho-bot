const { MessageEmbed } = require('discord.js');
const { Guilds } = require('../../dbObjects');

module.exports = {
	run: async (member) => {
		const guildObject = await Guilds.findOne({ where: { guild_id: member.guild.id } })
		const channelLogs = member.guild.channels.cache.get(guildObject.memberlogs_id)
	if(!channelLogs) return

	let newMember_embed = new MessageEmbed()
		.setAuthor(`${member.user.tag}(${member.id})`, member.user.avatarURL())
		.setTimestamp()
		.setDescription(
			`• Profile: ${member}\n• Created: \`${member.user.createdAt.toLocaleString()}\`\n• Joined: \`${member.joinedAt.toLocaleString()}\``
		)
		.setFooter('User joined')
		.setColor('11b309');
	channelLogs.send(newMember_embed);
	}
}