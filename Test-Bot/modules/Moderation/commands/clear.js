module.exports = {
    name: 'clear',
    description: 'Remove messages from a channel',
    cooldown: 5,
    args: 1,
    permission: 2,
    usage: '<num>',
    usageInfo: 'You can only delete up to 1999 messages',

    execute(message, args) {
        const num = parseInt(args[0]);

        if(isNaN(num)) {
             return message.channel.send(`\`\`${args[0]}\`\` is not a number.`);
        }

        const finalNum = num + 1;

        if(finalNum > 2000) {
            return message.channel.send('No se pueden borrar mas de 1999 mensajes a la vez.');
        }

        const v = parseInt(finalNum / 100);
        const final = finalNum - (v * 100);

        for(let i = 0; i < v; i++) {
            message.bulkDelete(100, true);
        }

        message.channel.bulkDelete(final, true);
    }
} 