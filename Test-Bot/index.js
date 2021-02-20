const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER']});
const antispam = require('better-discord-antispam');
const { Op } = require('sequelize');
const { Users, Guilds, GuildCommands, modMailUsers } = require('./dbObjects');
const currency = new Discord.Collection();
const userNotes = new Discord.Collection();
const { prefix } = require('./config.json');
module.exports = { userNotes };
require('dotenv').config();

/*Modules*/
const moduleFolders = fs
	.readdirSync('./modules');
client.modules = new Discord.Collection();
console.log(`modules on: ${moduleFolders.join(', ')}.`);

for (const folder of moduleFolders) {
	const module = require(`./modules/${folder}/index.js`);
	client.modules.set(folder, module);
}

const MODULES = client.modules;
/* modules end */

/* COMANDS */
client.commands = new Discord.Collection();

for(const folder of moduleFolders) {
  const files = fs
	  .readdirSync(`./modules/${folder}/commands`)
	  .filter(file => file.endsWith('.js'));

  for(const file of files) {
    const cmd = require(`./modules/${folder}/commands/${file}`);
    client.commands.set(
      cmd.name, 
      {
        req: cmd,
        module: folder
      }
    );
  }
}

/* COMANDS END */

/* DiscordEvents  */

const eventFolders = fs.readdirSync('./DiscordEvents');
const events = new Discord.Collection();

for(const folder of eventFolders) {
	events.set(folder, require(`./DiscordEvents/${folder}/index.js`));
}

/*  DiscordEvents END */

/////////////////////////////////

client.once('ready', async () => {
	antispam(client, {
		limitUntilWarn: 3, 
        limitUntilMuted: 5,
        interval: 2000,
		warningMessage: '{@user}, Please stop spamming.',
		mutedRole: "muted",
		exemptPermissions: [ 'ADMINISTRATOR'],
		ignoreBots: true,
		removeMessages: true,
	})
	console.log(`${client.user.username} is on!`);
	client.user.setActivity(
		'Testing'
	);
  const storedBalances = await Users.findAll();
  storedBalances.forEach(b => {
	  currency.set(b.user_id, b)
  });
  await modMailUsers.sync({ force: true });
  
});

client.on('message', async message => {
	if(message.author.bot) return;
	client.emit('checkMessage', message);
	if(message.channel.type !== 'dm') {
		const userObject = await Users.findOne({ where: { user_id: message.author.id, guild_id: message.guild.id } });
		const guildObject = await Guilds.findOne({ where: { guild_id: message.guild.id } });
		if(!userObject) {
			Users.upsert({ guild_id: message.guild.id, user_id: message.author.id });
		}
		if(!guildObject) {
			Guilds.upsert({ guild_id: message.guild.id });
		}
	} else {
		const userObject = await Users.findOne({ where: { user_id: message.author.id } }).catch(() => { message.channel.send('err4')})
		if(!userObject) return;
		let active = await userObject.isModMail()
		if(active[0]) return;
		const args = message.content.trim().split(/ +/);
		let mdcommand_ = client.commands.get('MDmodmail')
			let mdcommand = mdcommand_.req
			try {
				mdcommand.execute(message, args);
			} catch (error) {
				console.error(error);
				message.channel.send(embed
					.setDescription(':x: Error | A fatal error ocurred when executing the command, pls contact the developer.'));
			}
			return;
	}
	for (const name of moduleFolders) {
		MODULES.get(name).newMsg(message);
	}
});

for(const event of eventFolders) {
	client.on(event, (a, b, c) => {
		events.get(event).run(a, b, c);
	})
}
client.login('token'); // Please, if you use this public use an env file
