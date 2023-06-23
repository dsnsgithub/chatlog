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
		const message = interaction.options.getString("message");

		await axios.post(`${process.env["DYNMAP_IP"]}/up/sendmessage`, {
			name: "ChatLog",
			message: message
		});

		await interaction.reply("Posted to Dynmap");
	}
};
