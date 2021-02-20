const Discord = require('discord.js');
const { Users, Guilds } = require('../../../dbObjects');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    usage: '<user>',
    args: 1,
    permission: 3,
    cooldown: 2,
    async execute(message, args) {
      message.delete();
            
      const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => { return message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that user')) });
      
      const reason = args.slice(1).join(' ')  || 'No reason provided'    
      
      const embed = embedG(message); 

      embed.setDescription(`• Profile: \`${member.user.tag}\`(${member.id})\n• Moderator: ${message.author}\n• Reason: \`${reason}\``).setFooter('User kicked').setColor('ff9933').setThumbnail(member.user.displayAvatarURL())
      const guildObject = await Guilds.findOne({ where: { guild_id: message.guild.id } })
      const channel = message.guild.channels.cache.get(guildObject.modlogs_id)
      if (member) {
        if(member.kickable) {
          member.send(embed) 
  
          member.kick(reason).then(async () => {
            message.channel.send(embed);
            const userObject = await Users.findOne({ where: { user_id: member.id, guild_id: message.guild.id } });
            await userObject.addModlogs(message.author, 'kick', reason);
            if(channel){
              channel.send(embed)
            }
          })
        } else {
          message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t kick that user'))
        }
  }
}
}