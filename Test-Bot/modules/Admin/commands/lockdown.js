const Discord = require('discord.js');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'lockdown',
    description: 'lock the whole server',
    cooldown: 2,
    permission: 4,
    async execute(message, args) {
message.delete();

  const client = message.client;

		message.guild.channels.cache.forEach( c => {
		  c.updateOverwrite(message.guild.id, {SEND_MESSAGES: false });
		})

    const embed = embedG(message) 
        .setDescription("All the channels has been locked!")
        .setColor('ff3300') 
    message.channel.send(embed);

	}
}