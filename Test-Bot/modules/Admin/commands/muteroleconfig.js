const { Guilds } = require('../../../dbObjects');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'muterole',
    description: 'configurate the mute system',
    cooldown: 5,
    permission: 4,
    args: 1,
    usage: '',
    usageInfo: '',
    async execute(message, args) {
        const embed = embedG(message);
        if(args[0].toLowerCase() === 'create') {
            let role = await message.guild.roles.create({
                data: {
                  name: 'Muted',
                }})
            message.guild.channels.cache.forEach(c => {
                c.updateOverwrite(role, {
                    SEND_MESSAGES: false
                })
            })
            Guilds.upsert({ guild_id: message.guild.id, muterole_id: role.id });
            return message.channel.send(embed.setTitle(`Muted Role created`).setDescription(`• Guild: ${message.guild.name}\n• Role: ${role}`).setColor('3399ff'))
        }
        if(args[0].tolowerCase() === 'set') {
            if(!args[1]) return message.channel.send('Please specify the role for the mute system')
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if(role) {
                message.channel.send(embed.setTitle(`New Muted role`).setDescription(`• Guild: ${message.guild.name}\n• Role: ${role}`).setColor('3399ff'))
                return Guilds.upsert({ guild_id: message.guild.id, muterole_id: role.id });
            }
        
            message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that role'))
        }
    }
}