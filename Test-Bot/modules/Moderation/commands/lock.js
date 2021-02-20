const Discord = require('discord.js');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'lock',
    description: 'Lock a channel',
    permision: 2,
    permission: 3,
    cooldown: 2,
    async execute(message, args) {
message.delete();

    const client = message.client;

		message.channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: false });

    const embed = embedG(message)
        .setDescription("Channel locked!") 
        .setColor('ff9933') 

    message.channel.send(embed);

	}
}