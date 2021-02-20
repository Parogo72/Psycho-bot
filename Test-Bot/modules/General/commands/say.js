module.exports = {
    name: 'say',
    description: 'Make the bot say something',
    cooldown: 2,
    execute(message, args) {
        message.delete()
        message.channel.send(args.slice(0).join(' '));
    }
}