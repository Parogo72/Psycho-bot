const Discord = require('discord.js');

/* DELETE MESSAGE MODULE */
const delmsg = {
    del(message) {
        message.delete();
    }
}

/* General */
function embedG(message) {
		const embed = new Discord.MessageEmbed()
			.setTimestamp()
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL());

		return embed;
}

/*Funcion Numero*/
function valNum (parametro){
      return !/^([0-9])*$/.test(parametro);
} 

/* Export */
module.exports = { delmsg, embedG, valNum };