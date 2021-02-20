const Discord = require('discord.js');
const { Guilds, Users } = require('../../../dbObjects');
const ms = require("ms");
const { embedG, valNum } = require('../../../utility.js');

module.exports = {
    name: 'mute',
    description: 'Mute an user',
    usage: '<user> [time]',
    args: 1,
    aliases: ['tempmute'],
    permission: 2,
    cooldown: 2,
    async execute(message, args) {
     message.delete();
      
     const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => { return message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that user')) });
     let mutetime = args[1]; 
     let embed = embedG(message)
     const userObject = await Users.findOne({ where: { user_id: member.id }})
     const guild = await Guilds.findOne({ where: { guild_id: message.guild.id } });
     const roleID = guild.muterole_id
     let channel = message.guild.channels.cache.get(guild.modlogs_id)

      if(!roleID) {
        return  message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find mute role. Configurate it with the command `config muterole <role>` or create one with `config muterole create`'))
      }
      if(member.id === message.author.id) {
        return message.channel.send(":x: Error | You can\'t mute yourself :x:.");
      }    
      userObject.addModlogs(message.author, 'mute');
      if(!mutetime) { 
        let embed2 = embedG(message).setDescription(`• Profile: \`${member.user.tag}\`(${member.id})\n• Moderator: ${message.author}`).setFooter('User muted').setColor('ffff00').setThumbnail(member.user.displayAvatarURL())
        message.channel.send(embed2)  
        member.roles.add(roleID)
        if(channel) channel.send(embed2);
      } else {
        member.roles.add(roleID) 
        let embed = embedG(message)
        .setDescription(`• Profile: \`${member.user.tag}\`(${member.id})\n• Moderator: ${message.author}\n• Time: \`${ms(ms(mutetime))}\``).setFooter('User muted').setColor('ffff00').setThumbnail(member.user.displayAvatarURL())
        member.roles.add(roleID);
        message.channel.send(embed);
        if(channel) channel.send(embed);

        setTimeout(function() {
          member.roles.remove(roleID)
          let logsembed2 = embedG(message)
          .setDescription(`• Profile: \`${member.user.tag}\`(${member.id})\n• Moderator: ${message.author}\n`).setFooter('User unmuted').setColor('ffff00').setThumbnail(member.user.displayAvatarURL())
          message.channel.send(logsembed2); 
          if(channel) channel.send(logsembed2);
        }, ms(mutetime));
      } 
    }
}