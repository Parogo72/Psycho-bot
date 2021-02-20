const Discord = require('discord.js');
const { Users, Guilds } = require('../../../dbObjects');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'modlogs',
    description: 'show the modlogs from an user',
    usage: '<user>',
    args: 1, 
    permission: 2,
    cooldown: 2,
    async execute(message, args) {
        message.delete();

      const member = message.mentions.users.first() ||  await message.client.users.fetch(args[0]).catch(() => { return message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that user')) });
      
      const embed = embedG(message); 
      embed.setAuthor(`${member.tag}(${member.id})`, member.displayAvatarURL());

      if(member) {
        const userObject = await Users.findOne({ where: { user_id: member.id, guild_id: message.guild.id } });
        const banLogs = await userObject.getModlogs('ban')
        const kickLogs = await userObject.getModlogs('kick')
        const muteLogs = await userObject.getModlogs('mute')
        const warnLogs = await userObject.getModlogs('warn')
        if(banLogs[0]) {
            embed.setDescription(`**Bans[${banLogs.length}]**\n` + banLogs.map(i => `• Case: ${i.case_number}\n• Moderator: <@${i.executor_id}>\n• Reason: \`${i.reason}\``).join('\n\n'))
            message.channel.send(embed)
        }
        if(kickLogs[0]) {
            embed.setDescription(`**Kicks[${kickLogs.length}]**\n` + kickLogs.map(i => `• Case: ${i.case_number}\n• Moderator: <@${i.executor_id}>\n• Reason: \`${i.reason}\``).join('\n\n'))
            message.channel.send(embed)
        }
        if(muteLogs[0]) {
            embed.setDescription(`**Mutes[${muteLogs.length}]**\n` + muteLogs.map(i => `• Case: ${i.case_number}\n• Moderator: <@${i.executor_id}>`).join('\n\n'))
            message.channel.send(embed)
        }
        if(warnLogs[0]) {
            embed.setDescription(`**Warns[${warnLogs.length}]**\n` + warnLogs.map(i => `• Case: ${i.case_number}\n• Moderator: <@${i.executor_id}>\n• Reason: \`${i.reason}\``).join('\n\n'))
            message.channel.send(embed)
        }
      } else {
        message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that user'))
      }

    }
}