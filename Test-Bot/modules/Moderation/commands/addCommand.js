const { Guilds } = require('../../../dbObjects');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'addcommand',
    description: 'create a command for this guild',
    cooldown: 5,
    args: 2,
    permission: 2,
    usage: '<name> <text>',
    async execute(message, args) {
        const embed = embedG(message);
        
        const guildObject = await Guilds.findOne({ where: { guild_id: message.guild.id } });
        await guildObject.addCommand(args[0], args.slice(1).join(' ')).catch(() =>{
            message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('A command with that name already exists!'))
        })
        const channel = message.guild.channels.cache.get(guildObject.modlogs_id)
        if(channel) {
            channel.send(embed.setDescription(`• Command name: \`${args[0]}\`\n• Moderator: ${message.author}\n• Command: \`${args.slice(1).join(' ')}\``).setFooter('Command created').setColor('3399ff'))
        }
        return message.channel.send(embed.setDescription(`• Command name: \`${args[0]}\`\n• Moderator: ${message.author}\n• Command: \`${args.slice(1).join(' ')}\``).setFooter('Command created').setColor('3399ff'));
    }
}