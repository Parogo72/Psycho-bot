const Discord = require('discord.js');
const { Users, Guilds } = require('../../../dbObjects');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'warn',
    description: 'warn a user from the server',
    usage: '<user> [reason]',
    args: 1, 
    permission: 2,
    cooldown: 2,
    async execute(message, args) {
        message.delete();

        const embed = embedG(message); 
        
      const member = message.mentions.members.first() ||  await message.guild.members.fetch(args[0]).catch(() => { return message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that user')) });
      
      let reason = args.slice(1).join(' ')  || 'No reason provided'
  
      embed.setDescription(`• Profile: \`${member.user.tag}\`(${member.id})\n• Moderator: ${message.author}\n• Reason: \`${reason}\``).setFooter('User warned').setColor('ffff00').setThumbnail(member.user.displayAvatarURL())
      const guildObject = await Guilds.findOne({ where: { guild_id: message.guild.id } })
      const channel = message.guild.channels.cache.get(guildObject.modlogs_id)
      if (member) {
        const userObject = await Users.findOne({ where: { user_id: member.id, guild_id: message.guild.id } });
        await userObject.addModlogs(message.author, 'warn', reason);
        message.channel.send(embed);
            if(channel) {
              channel.send(embed)   
            } 
      } else {
        message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that user'))
      }
    }
}