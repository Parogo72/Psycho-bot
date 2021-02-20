module.exports = {
    name: 'ping',
    description: 'Check the bot\'s ping (ms)',
    aliases: ['ms'],
    cooldown: 2,
    execute(message) {
        const ms = Math.abs(Date.now() - message.createdTimestamp);
        message.channel.send(':ping_pong: Pong! `' + ms + '`ms');
    }
}