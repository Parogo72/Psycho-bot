const Discord = require('discord.js');
const { prefix } = require('../../../config.json');
const fs = require('fs');
const { embedG } = require('../../../utility.js');

const mdleDirName = fs.readdirSync('./modules');

module.exports = {
	name: 'help',
	description: 'a list of commands',
	aliases: ['commands', 'h'],
	usage: '[comand name]',
	cooldown: 7,
	execute(message, args) {
		const embed = embedG(message);
    embed.setColor('#a942ce')
		const { commands } = message.client;
    // permissions
    let permission = 0
    if(message.member.permissions.has('ADMINISTRATOR')) {
      permission = 4 
    } else if(message.member.permissions.has('BAN_MEMBERS') || message.member.permissions.has('KICK_MEMBERS')) {
      permision = 3
    } else if(message.member.permissions.has('MANAGE_MESSAGES')) {
      permission = 2
    } else if(message.member.premiumSince) {
      permission = 1 
    } 
    

		if (!args.length) {
      
      // set modules
      const mdl = new Discord.Collection();

      for(const mdlName of mdleDirName) {
        mdl.set(mdlName, new Discord.Collection());
      }

      for(const cmd of commands) {
        const c = cmd[1];

        const mdle = c.module;

        let bloq = false;
        if(!!c.req.permission) if(permission < c.req.permission) bloq = true;
        if(c.req.name == 'MDmodmail') bloq = true
        if(!bloq) mdl.get(mdle).set(c.req.name, c.req);
      }
      
			embed.setTitle('📋 Help 📋');
      embed.setDescription(`You can send \`${prefix}help [command name]\` to get info on a specific command!\nPermission level: \`${permission}\``);

      for(const mdlName of mdleDirName) {
        
      const txt = mdl.get(mdlName).map(command => command.name).join(`\u200B\n`) || 'there are no commands';
        const num = mdl.get(mdlName).size || 0;
        if(num === 0) continue;
        embed.addField(`${mdlName} [${num}]`, `\`\`\`${txt}\`\`\``, true)
      }

			return message.channel.send(embed);
		}
		
		const name = args[0].toLowerCase();
		const command_ = commands.get(name) || commands.find(c => c.req.aliases && c.req.aliases.includes(name));

		if (!command_) {
			return message.reply(embed.setTitle('Error').setColor('#ff0000').setDescription('That\'s not a valid command!\nTo see the full list of the commands type `' + prefix + 'help`'));
		}
		const command = command_.req; 
		
    let bloq = false;
    if(!!command.permision) if(permision < command.permision) bloq = true;
    if(bloq) return message.channel.send(new Discord.MessageEmbed().setTitle('Error.').setDescription('You don\'t have enough permissions to execute this command').setColor('#ff0000')); 

		embed.addField('Name:', command.name, true);

		if (command.aliases) embed.addField('Aliases:', command.aliases.join(', '), true);
		if (command.description) embed.addField('Description:', command.description);
		if (command.usage) {
			if(command.usageInfo) {
				embed.addField('Usage:', `\`${prefix}${command.name} ${command.usage}\`\n${command.usageInfo}`, false);
			} else {
				embed.addField('Usage:', `\`${prefix}${command.name} ${command.usage}\``, true);
			}
		}

		embed.addField('Cooldown:', `\`${command.cooldown || 3}\` second(s)`, true);

		message.channel.send(embed.setTitle(`Help Command`));
	}
};