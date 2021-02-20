const { Guilds } = require('../../../dbObjects');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'config',
    description: 'configurate the bot',
    cooldown: 5,
    permission: 4,
    args: 1,
    usage: '<type> [config]',
    usageInfo: '**Examples:**\n `show`: will show actual config\n `modlogs <channel>`: sets the modlogs channel\n `logs <channel>`: sets the logs channel\n `memberlogs <channel>`: sets the memberlogs channel',
    async execute(message, args) {
        const embed = embedG(message);
        let type = args[0].toLowerCase()
        if(type === 'show') {
            let guild_object = await Guilds.findOne({ where: { guild_id: message.guild.id }})
            let logschannel = message.guild.channels.cache.get(guild_object.logs_id) || 'Not specified'
            let memberlogschannel = message.guild.channels.cache.get(guild_object.memberlogs_id) || 'Not specified'
            let modlogschannel = message.guild.channels.cache.get(guild_object.modlogs_id) || 'Not specified'
            let muterole = message.guild.roles.cache.get(guild_object.muterole_id) || 'Not specified'
            let supportrole = message.guild.roles.cache.get(guild_object.support_id) || 'Not specified'
            let modmailchannel = message.guild.channels.cache.get(guild_object.modmail_id) || 'Not specified'
            embed.setTitle(`Config for ${message.guild.name}`).setDescription(`• **Guild**: ${message.guild.name}\n• **Logs channel**: ${logschannel}\n• **Modlogs channel**: ${modlogschannel}\n• **Memberlogs channel**: ${memberlogschannel}\n• **Modmail category**: ${modmailchannel}\n• **Mute role**: ${muterole}\n• **Support role**: ${supportrole}`).setColor('3399ff')
            return message.channel.send(embed)
        }

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.get(args[2]) || message.channel
        
        if(!channel) return message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that channel'))
        if(type === 'modlogs') {
            Guilds.upsert({ guild_id: message.guild.id, modlogs_id: channel.id });
            return message.channel.send(embed.setTitle(`New ${args[0].toLowerCase()} channel`).setDescription(`• Guild: ${message.guild.name}\n• Channel: ${channel}`).setColor('3399ff'))
        } else if(type === 'memberlogs') {
            Guilds.upsert({ guild_id: message.guild.id, memberlogs_id: channel.id });
            return message.channel.send(embed.setTitle(`New ${args[0].toLowerCase()} channel`).setDescription(`• Guild: ${message.guild.name}\n• Channel: ${channel}`).setColor('3399ff'))
        } else if(type === 'logs') {
            Guilds.upsert({ guild_id: message.guild.id, logs_id: channel.id });
            return message.channel.send(embed.setTitle(`New ${args[0].toLowerCase()} channel`).setDescription(`• Guild: ${message.guild.name}\n• Channel: ${channel}`).setColor('3399ff'))
        } else if(type === 'modmail') {
            if(args[1].toLowerCase() === 'add') {
                let guild_object = await Guilds.findOne({ where: { guild_id: message.guild.id }})
                let name = args.slice(2).join(' ')
                guild_object.addGuildModMail(name)
                return message.channel.send(embed.setTitle(`New modmail thread`).setDescription(`• Guild: ${message.guild.name}\n• Name: ${name}`).setColor('3399ff'))
            } else {
                return
            }
        }
    }
}