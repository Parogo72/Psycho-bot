const { Guilds } = require('../../../dbObjects');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'modmail',
    description: 'configurate the modmail system',
    cooldown: 5,
    permission: 4,
    args: 1,
    usage: '<create or set>',
    usageInfo: 'If you choose create it will automatically create the modmail system, if you choose set you will have to put a role id or the category id',
    async execute(message, args) {
        const embed = embedG(message);
        if(args[0].toLowerCase() === 'create') {
            let category = await message.guild.channels.create('Tickets', { 
                type: 'category',
                reason: 'Support category created'
            })
            let role = await message.guild.roles.create({
                data: {
                    name: 'Support',
                    color: 'YELLOW'
                },
                reason: 'Support role created'
            })
            let modmail_logs = await message.guild.channels.create('Ticket-logs', { 
                type: 'text',
                reason: 'Support logs created',
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: role.id,
                        allow: ['VIEW_CHANNEL'],
                    }
                ],
                parent: category.id
            })
            message.channel.send(embed.setTitle(`New modmail category`).setDescription(`• Guild: ${message.guild.name}\n• Channel: ${category}`).setColor('3399ff'))
            message.channel.send(embed.setTitle(`New modmail logs channel`).setDescription(`• Guild: ${message.guild.name}\n• Channel: ${category}`).setColor('3399ff'))
            message.channel.send(embed.setTitle(`New Support role`).setDescription(`• Guild: ${message.guild.name}\n• Role: ${role}`).setColor('3399ff'))
            Guilds.upsert({ guild_id: message.guild.id, modmaillogs_id: modmail_logs.id, modmail_id: category.id, support_id: role.id });
            let guild_object = await Guilds.findOne({ where: { guild_id: message.guild.id }})
            guild_object.addGuildModMail('support')
            guild_object.addGuildModMail('bugs')
            guild_object.addGuildModMail('reports')
            guild_object.addGuildModMail('need info')
        }
        if(args[0].toLowerCase() === 'thread') {
            let guild_object = await Guilds.findOne({ where: { guild_id: message.guild.id }})
            if(!args[1]) return message.channel.send('Please specify if you want to `add` or `delete`')
            let name = args.slice(2).join(' ').toLowerCase()
            if(args[1].toLowerCase() === 'add') {
                let threads = await guild_object.getModmail()
                if(threads.length === 0) {
                    guild_object.addGuildModMail('support')
                    guild_object.addGuildModMail('bugs')
                    guild_object.addGuildModMail('reports')
                    guild_object.addGuildModMail('need info')
                }
                return guild_object.addGuildModMail(name)
            } else if(args[1].toLowerCase() === 'delete') {
                return guild_object.deleteGuildModMail(name)
            } else {
                return message.channel.send('Please specify if you want the thread name')
            }
        }
        if(args[0].toLowerCase() === 'set') {
            if(!args[1]) return message.channel.send('Please specify the category or role for the modmail')
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let channel = message.guild.channels.cache.get(args[1]);
            if(role) {
                message.channel.send(embed.setTitle(`New Support role`).setDescription(`• Guild: ${message.guild.name}\n• Role: ${role}`).setColor('3399ff'))
                return Guilds.upsert({ guild_id: message.guild.id, support_id: role.id });
            }
            if(channel) {
                if(channel.type === 'category') {
                    message.channel.send(embed.setTitle(`New modmail category`).setDescription(`• Guild: ${message.guild.name}\n• Channel: ${channel}`).setColor('3399ff'))
                    return Guilds.upsert({ guild_id: message.guild.id, modmail_id: channel.id });
                }
                if(channel.type === 'text') {
                    message.channel.send(embed.setTitle(`New modmail logs channel`).setDescription(`• Guild: ${message.guild.name}\n• Channel: ${channel}`).setColor('3399ff'))
                    return Guilds.upsert({ guild_id: message.guild.id, modmaillogs_id: channel.id });
                }
            }
            message.channel.send(embed.setTitle('Error').setColor('#ff0000').setDescription('I couldn\'t find that category or role'))
        }
    }
}