const Discord = require('discord.js');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'unlockdown',
    description: 'Unlock the server',
    cooldown: 2,
    permission: 4,
    async execute(message, args) {
message.delete();

  const client = message.client;

		message.guild.channels.cache.forEach( c => {
		  c.updateOverwrite(message.guild.id, {SEND_MESSAGES: null }); 
		})

    const embed = embedG(message) 
        .setDescription("All the channels has been unlocked!")
        .setColor('ff9933') 
    message.channel.send(embed);

	}
}