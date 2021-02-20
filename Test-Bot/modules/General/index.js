const Discord = require('discord.js');

const { prefix } = require('../../config.json');
const { GuildCommands } = require('../../dbObjects');

const cooldowns = new Discord.Collection();

module.exports = {
	async newMsg(message) {
		const client = message.client;

		if (!message.content.startsWith(prefix) || !message.guild) return;
	
		const embed = new Discord.MessageEmbed()
			.setTitle('Error')
			.setTimestamp()
			.setColor('#FF0000'); 
		
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		const guildCommand = await GuildCommands.findOne({
			where: { guild_id: message.guild.id, command_name: commandName},
		});

		if(guildCommand) {
			message.channel.send(guildCommand.text)
		}

		if(commandName == 'MDmodmail') return

    	const command_ = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.req.aliases && cmd.req.aliases.includes(commandName));
			
			if (!command_) return; 

    const command = command_.req;

	let permission = 0
    	if(message.member.permissions.has('ADMINISTRATOR')) {
      		permission = 4 
    	} else if(message.member.permissions.has('BAN_MEMBERS') || message.member.permissions.has('KICK_MEMBERS')) {
      		permission = 3
    	} else if(message.member.permissions.has('MANAGE_MESSAGES')) {
      		permission = 2
    	} else if(message.member.premiumSince) {
      		permission = 1 
    	} 
		if(command.permission > permission) {
			return message.channel.send(':x: Error | You don\'t have enough permissions to execute this command :x:.');
    	}


    // filtre args
		if (command.args > args.length) {
			let reply = `:x: Error | You haven\'t specified the correct arguments :x:.`;

			if (command.usage) {
				reply += `\nThe correct use would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}
		// execute
		try {
			command.execute(message, args);
		} catch (error) {
			console.error(error);
			message.channel.send(embed
				.setDescription(':x: Error | A fatal error ocurred when executing the command, pls contact the developer.'));
		}
	}
}