const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

require("dotenv").config();

axios.defaults.validateStatus = (status) => {
	// axios rejects promise if status code is not 200, fixed
	return true;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("send")
		.setDescription("Sends message through Dynmap!")
		.addStringOption((option) => option.setName("message").setDescription("Chat Message").setRequired(true)),
	async execute(interaction) {
		let message = interaction.options.getString("message");
		message = `${interaction.user.username} says: ${message}`

		await axios.post(`${process.env["DYNMAP_IP"]}/up/sendmessage`, {
			name: interaction.user.username,
			message: message
		});

		await interaction.reply({ content: `Posted to Dynmap under ${interaction.user.username}`, ephemeral: true });
	}
};
