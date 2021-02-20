const ms = require('ms')

module.exports = {
    name: 'slowmode',
    description: 'create a slowmode in a channel',
    cooldown: 5,
    args: 1,
    permission: 3,
    usage: '<time>',
    execute(message, args) {
      message.channel.setRateLimitPerUser(ms(args[0])/1000).catch(() => message.reply(embed.setTitle('Error').setColor('#ff0000').setDescription('There was an error when trying to make the slowmode, make sure that the time is lower than 6 hours')))
    }
}