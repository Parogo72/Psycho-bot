const Discord = require('discord.js');
/* General */
function embedG(message) {
		const embed = new Discord.MessageEmbed()
			.setTimestamp()
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL());

		return embed;
}
/* Export */
module.exports = { embedG };
