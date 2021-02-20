const Discord = require('discord.js')
const { Guilds, Users } = require('../../../dbObjects');
const { prefix } = require('../../../config.json');
const { embedG } = require('../../../utility.js');

module.exports = {
    name: 'MDmodmail',
    async execute(message, args) { 
        message.react('✅')
        const userObject = await Users.findOne({ where: { user_id: message.author.id } })
        let guild_objects = await userObject.getGuilds()
        userObject.addModMail()
        let number = 0;
        let text = []
        guild_objects.forEach(i => {
            let g = message.client.guilds.cache.get(i.guild_id)
            number++
            text.push(`\`>\`**[${number}]** ${g.name}`)
        })
        
        let embed = new Discord.MessageEmbed()
        .setTitle('New Thread')
        .setDescription(`Hello ${message.author}!\n\nPlease select which one of the following servers you want to contact with by typing the number:\n\n${text.join('\n')}.`)
        .setTimestamp()
        .setColor('#a942ce')
        message.channel.send(embed)
        let guild_amount = text.length
        const collector = message.channel.createMessageCollector(m => !m.author.bot && Number(m.content) <= guild_amount, { time: 60000, max: 1 });
        collector.on('collect', collected => {
            if(collected.content.toLowerCase() === 'cancel') {
                userObject.removeModMail()
                let embed2 = new Discord.MessageEmbed()
                .setDescription('The ModMail has been canceled, please consider contacting us again for any issues you have.')
                .setColor('ff0000')
                message.channel.send(embed2)
                collector.stop('canceled')
                return
            }
        })
        collector.on('end', async (collected, reason) => {
            if(reason === 'time' || collected.first().content.toLowerCase() === 'cancel') {
                userObject.removeModMail()
                let embed2 = new Discord.MessageEmbed()
                .setDescription('The ModMail has been canceled, please consider contacting us again for any issues you have.')
                .setColor('ff0000')
                message.channel.send(embed2)
            } else if(reason === 'canceled') {
                return
            } else {
                collected.first().react('✅')
                let guild_modmail = guild_objects[collected.first().content - 1]
                let guild = message.client.guilds.cache.get(guild_modmail.guild_id)
                let guild_object = await Guilds.findOne({ where: { guild_id: guild.id}})
                let modmail_logs = guild.channels.cache.get(guild_object.modmaillogs_id)
                let guild_Text = await guild_object.getModmail();
                if(!guild_Text[0] || !guild_object.support_id) {
                    userObject.removeModMail()
                    return message.channel.send('This guild has no ModMail system configurated')
                }
                let text2 = []
                number = 0;
                guild_Text.forEach(g => {
                    number++
                    text2.push(`\`>\`**[${number}]** ${g.name}`)
                })
                embed.setTitle('Thread Created')
                embed.setDescription(`Thanks for contacting us ${message.author}!\n\nA new thread was created with the guild ${guild.name}. The Staff has already received your message. You can end this thread by writing \`${prefix}close\`. Please now select the thread category by typing the number: \n\n${text2.join('\n')}`)
                message.channel.send(embed)
                const collector2 = message.channel.createMessageCollector(m => !m.author.bot && Number(m.content) <= text2.length, { time: 30000, max: 1 });

                let tchannel = await guild.channels.create(('Ticket_' + message.author.tag).replace(/[^a-zA-z0-9 ]/g, "").trim().toLowerCase(), {
                    type: "text",
                    permissionOverwrites: [
                      {
                        id: guild.id, 
                        deny: ["VIEW_CHANNEL"] 
                      },
                      {
                        id: guild_object.support_id,
                        allow: ["VIEW_CHANNEL"],
                        deny: ['SEND_MESSAGES']
                      }
                    ],
                    parent: guild_object.modmail_id 
                  })
                  let tchannel_embed = new Discord.MessageEmbed()
                  .setAuthor(message.author.tag, message.author.displayAvatarURL())
                  .setDescription(`${message.author.tag} started a thread. React with 📌 to claim the ticket and help the user`)
                  .setTimestamp()
                  .setColor('9966ff')
                  tchannel.send(`<@&${guild_object.support_id}>`)
                  let embedReact = await tchannel.send(tchannel_embed) 
                  tchannel.send(new Discord.MessageEmbed()
                  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
                  .setDescription(message.content)
                  .setTimestamp()
                  .setFooter('User')
                  .setColor('ffcc00'))
                  embedReact.react('📌')
                  let min = 1;
                  let moderators = [];
                const claimcollector = embedReact.createReactionCollector((reaction, user) => !user.bot && reaction.emoji.name === '📌' && message.author.id !== user.id)
                const unclaimcollector = embedReact.createReactionCollector((reaction, user) => !user.bot && reaction.emoji.name === '📌' && message.author.id !== user.id, { dispose: true })
                const collector_user = message.channel.createMessageCollector(m => !m.author.bot);
                const collector_mod = tchannel.createMessageCollector(m => !m.author.bot);
                claimcollector.on('collect', (reaction, user) => {
                  moderators.push(user.id)
                    tchannel.updateOverwrite(user, {
                      SEND_MESSAGES: true
                    })
                    tchannel.updateOverwrite(guild_object.support_id, {
                      SEND_MESSAGES: false
                    })
              
                    tchannel.send(`Ticket has been claimed by ${user}`)
                  })

                  unclaimcollector.on('remove', (reaction, user) => {   
                    tchannel.updateOverwrite(user, {
                      SEND_MESSAGES: false
                    })
              
                    tchannel.send(`Ticket has been unclaimed by ${user}`)
                  })
                  let embed2 = new Discord.MessageEmbed()
                collector_user.on('collect', async collected =>{
                    if(min != 1) {
                        collected.react('✅')
                        if(collected.content.toLowerCase() === `${prefix}close`) {
                            
                            embed2.setTitle('Thread Ended').setColor('#ff0000').setDescription(`This thread has been closed by ${collected.author.tag}`)
                            tchannel.send(embed2)
                            collector_user.stop();
                            collector_mod.stop();
                         } else {
                        let embed2 = new Discord.MessageEmbed()
                        .setAuthor(`${collected.author.tag}`, collected.author.displayAvatarURL())
                        .setDescription(collected.content)
                        .setTimestamp()
                        .setFooter('User')
                        .setColor('ffcc00')
                        tchannel.send(embed2)
                         }
                    }
                    min++
                })
                collector_mod.on('collect', collected =>{
                    if(collected.content.toLowerCase() === `${prefix}close`) {
                        let embed2 = new Discord.MessageEmbed()
                        embed2.setTitle('Thread Ended').setColor('#ff0000').setDescription(`This thread has been closed by ${collected.author.tag}`)
                        tchannel.send(embed2)
                        embed2.setDescription(`Thanks for opening this ticket. Hope that we could help you today! Don\'t mind opening another ticket if you have another issue\n This thread has been closed by ${collected.author.tag}`)
                        message.channel.send(embed2)
                        collector_user.stop();
                        collector_mod.stop();
                        
                      } else {
                      let embed2 = new Discord.MessageEmbed()
                      .setAuthor(`${collected.author.tag}`, collected.author.displayAvatarURL())
                      .setDescription(collected.content)
                      .setTimestamp()
                      .setFooter('Moderator')
                      .setColor('33cc33')
                      collected.delete()
                      tchannel.send(embed2)
                      message.channel.send(embed2)
                      }
                })
                let option;
                collector2.on('end', async (collected, reason) => {
                    if(reason === 'time') {
                        option = 'other'
                    } else {
                        let option_ = guild_Text[collected.first().content - 1]
                        option = option_.name
                        collected.first().react('✅')
                    }
                    embed.setTitle('Thread Reason')
                    embed.setDescription(`You have selected \`${option}\` as your thread reason. You can end this thread by writing \`${prefix}close\`. Every message that you send from this channel will be sent to the moderators from ${guild.name}`)
                    message.channel.send(embed)
                    tchannel.send(new Discord.MessageEmbed().setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
                    .setDescription(`The user chosed \`${option}\` as his reason to open this thread`)
                    .setTimestamp()
                    .setFooter('Bot')
                    .setColor('9966ff'))
                    if(modmail_logs) {
                      modmail_logs.send(embedG(message).setDescription(`• Profile: \`${message.author.tag}\`(${message.author.id})\n• Reason: ${option}`).setFooter('Ticket opened').setColor('9966ff').setThumbnail(message.author.displayAvatarURL()))
                    }
                })
                collector_user.on('end', async () => {
                    setTimeout( () =>{
                        tchannel.delete()
                    }, 30000)
                  if(!moderators[0]) {
                    embed2.setDescription(`Thanks for opening this ticket. Hope that we could help you today! Don\'t mind opening another ticket if you have another issue\n This thread has been closed by ${collected.first().author.tag}`)
                    message.channel.send(embed2)
                  }
                  let rating_embed = new Discord.MessageEmbed()
                  .setTitle('How would you rate the moderators that attended you?')
                  .setDescription(`• **Moderators:** ${moderators.map( id => `<@${id}>`).join(' \\| ')}\n• **Rate:** Please choose a number to rate from 1 to 10`)
                  .setColor('9966ff')
                  message.channel.send(rating_embed)
                  const collector_user2 = message.channel.createMessageCollector(m => !m.author.bot, { time: 600000 });
                  let num = 1
                  let rate;
                  let modmail_message;

                  if(modmail_logs) {
                    modmail_message = await modmail_logs.send(new Discord.MessageEmbed().setAuthor(`${message.author.tag}`, message.author.displayAvatarURL()).setDescription(`• Profile: \`${message.author.tag}\`(${message.author.id})\n• Reason: ${option || 'Not specified'}`).setFooter('Ticket closed').setColor('ff6666').setThumbnail(message.author.displayAvatarURL()))
                  }

                  collector_user2.on('collect', collected => {
                    if(isNaN(Number(collected.content)) && num != 1) {
                      collected.react('✅')
                      collector_user2.stop()
                      modmail_message.edit(new Discord.MessageEmbed().setAuthor(`${message.author.tag}`, message.author.displayAvatarURL()).setDescription(`• Profile: \`${message.author.tag}\`(${message.author.id})\n• Reason: ${option}\n• Rating: **${rate}**`).addField('Feedback:', collected.content).setFooter('Ticket closed').setColor('ff6666').setThumbnail(message.author.displayAvatarURL()))
                      message.channel.send('Thanks for the feedback, the staff team has received your rating and will take it to account.')
                      setTimeout(async () => {
                        await userObject.removeModMail()
                      }, 2000);
                    } else if(Number(collected.content) > 10 && Number(collected.content) < 1){
                      message.channel.send('Please select a number between 1 and 10')
                    } else {
                      collected.react('✅')
                      rate = Number(collected.content);
                      let ask_embed = new Discord.MessageEmbed()
                      .setTitle('We would also like to know how the experience was')
                      .setDescription('Please describe how your experience was with the staff team, this will help us get some feedback from the users for us to improve our system.\nIf you dont want to rate us, please don\'t answer this message')
                      .setColor('9966ff')
                      message.channel.send(ask_embed)
                      num++
                    }
                  })
                })
            }
        }) 

    }
}
