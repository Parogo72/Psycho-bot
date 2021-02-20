const Discord = require('discord.js');
const { embedG } = require('./../../../utility.js');

module.exports = {
    name: 'unmute',
    description: 'Unmute a user',
    args: 1,
    usage: '<user>',
    permission: 2,
    cooldown: 2,
    async execute(message, args) {
    message.delete();
  
  const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => { return message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that user')) });

  if(member.id === message.author.id) {
    return message.channel.send(":x: Error | You can't unmute yourself :x:.");
  }
  const guild = await Guilds.findOne({ where: { guild_id: message.guild.id } });
  const roleID = guild.muterole_id
  let muterole = message.guild.roles.cache.get(roleID)

  if(!roleID) {
    return  message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find mute role. Configurate it with the command `config muterole <role>` or create one with `config muterole create`'))
  }
     
  member.roles.remove(muterole)

  let channel = message.guild.channels.cache.get(guild.modlogs_id)

  let embed = embedG(message)
        .setDescription(`• Profile: \`${member.user.tag}\`(${member.id})\n• Moderator: ${message.author}\n`).setFooter('User unmuted').setColor('ffff00').setThumbnail(member.user.displayAvatarURL())

  message.channel.send(embed)

  if(channel) {
      channel.send(embed)
  }
    
  member.send(`You have been unmuted in **${message.guild.name}**`).catch(() => console.log('couldn\'t DM'))

  }
};

