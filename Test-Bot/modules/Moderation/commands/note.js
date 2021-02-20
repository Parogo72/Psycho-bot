const { Users, Guilds, UserNotes } = require('../../../dbObjects');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'notes',
    description: 'create notes for an user',
    cooldown: 5,
    args: 2,
    permission: 2,
    aliases: ['note'],
    usage: '<type> <user>',
    async execute(message, args) {
        const embed = embedG(message);
        let type = args[0].toLowerCase()
        const guildObject = await Guilds.findOne({ where: { guild_id: message.guild.id } });
        let user = message.mentions.users.first() || await message.client.users.fetch(args[1]).catch(() => { return message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that user')) });
        if(!user) {
            return message.reply(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that user'));
        }
        const userObject = await Users.findOne({ where: { user_id: user.id, guild_id: message.guild.id } });
        if(type === 'add' || type === 'create') {
            await userObject.addNotes(args.slice(2).join(' '), message.author);
            const channel = message.guild.channels.cache.get(guildObject.modlogs_id)
            if(channel) {
                channel.send(embed.setDescription(`• Profile: \`${user.tag}\`(${user.id})\n• Moderator: ${message.author}\n• Note: \`${args.slice(2).join(' ')}\``).setFooter('Note created').setColor('3399ff').setThumbnail(user.displayAvatarURL()))
            }
            return message.channel.send(embed.setDescription(`• Profile: \`${user.tag}\`(${user.id})\n• Moderator: ${message.author}\n• Note: \`${args.slice(2).join(' ')}\``).setFooter('Note created').setColor('3399ff').setThumbnail(user.displayAvatarURL()));
        }
        if(type === 'show') {
            const notes = await userObject.getNotes();
            return message.channel.send(embed.setDescription(`• Profile: ${user}\n• Notes:\n${notes.map(i => `**[${i.note_number}]** \`${i.text}\``).join('\n')}`).setColor('3399ff').setThumbnail(user.displayAvatarURL()))
        }
        if(type === 'delete') {
            if(!args[2]) {
                return message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('You didn\'t select any note to delete'))
            }
            let note = await UserNotes.findOne({where: { note_number: Number(args[2]) }})
            await userObject.deleteNotes(args[2])
            const channel = message.guild.channels.cache.get(guildObject.modlogs_id)
            if(channel) {
                channel.send(embed.setDescription(`• Profile: \`${user.tag}\`(${user.id})\n• Moderator: ${message.author}\n• Note: \`${note.text}\``).setFooter('Note deleted').setColor('ffff00').setThumbnail(user.displayAvatarURL()))
            }
            return message.channel.send(embed.setDescription(`• Profile: \`${user.tag}\`(${user.id})\n• Moderator: ${message.author}\n• Note: \`${note.text}\``).setFooter('Note deleted').setColor('ffff00').setThumbnail(user.displayAvatarURL()));
        }
    }
}