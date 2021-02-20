const Discord = require('discord.js');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'unlock',
    description: 'Unlock the channel',
    cooldown: 2,
    permission: 3,
    async execute(message, args) {
message.delete();

  const client = message.client;

		message.channel.updateOverwrite(message.guild.id, {SEND_MESSAGES: null });

    const embed = embedG(message) 
        .setDescription("Channel unlocked!")
        .setColor('3399ff') 
    message.channel.send(embed);

	}
}