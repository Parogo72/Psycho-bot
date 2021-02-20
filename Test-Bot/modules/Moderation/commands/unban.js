const Discord = require('discord.js');
const { Users, Guilds } = require('../../../dbObjects');
const { embedG } = require('../../../utility.js');

module.exports = {
	name: 'unban',
	description: 'Unban an user from the server',
  args: 1,
  permission: 3,
	cooldown: 2,
	async execute(message, args)   {
message.delete();

  const client = message.client;
  
  let reason = args.slice(1).join(' ')  || 'No reason provided'
  const embed = embedG(message); 

  const guildObject = await Guilds.findOne({ where: { guild_id: message.guild.id } })
  const channel = message.guild.channels.cache.get(guildObject.modlogs_id)
    message.guild.members.unban(args[0]).then( u =>{

      embed.setDescription(`• Profile: \`${u.tag}\`(${u.id})\n• Moderator: ${message.author}\n• Reason: \`${reason}\``).setThumbnail(u.displayAvatarURL()).setFooter(`User unbanned`)
      message.channel.send(embed)
      if(channel) {
        channel.send(logsembed)
      }
      return
      }).catch(() => {
      return message.reply(embed.setTitle('Error').setColor('#ff0000').setDescription('That user is not baned from this guild'));
    })
    
  }

}

