require("dotenv").config();
const axios = require("axios");

axios.defaults.validateStatus = (status) => {
	// axios rejects promise if status code is not 200, fixed
	return true;
};

const fs = require("node:fs");
const path = require("node:path");

const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
		} else {
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	}
});

let latestChatTimestamp = 0;
client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

	const logChannel = client.channels.cache.get(process.env["CHANNEL_ID"]);

	setInterval(async () => {
		const response = await axios.get(`${process.env["DYNMAP_IP"]}/up/world/world/`);
		const updates = response["data"]["updates"];

		for (const update of updates) {
			if (update["type"] == "chat") {
				if (update["timestamp"] > latestChatTimestamp) {
					logChannel.send(`${update["playerName"]}: ${update["message"]}`);
					latestChatTimestamp = update["timestamp"];
				}
			}

			if (update["type"] == "playerquit") {
				if (update["timestamp"] > latestChatTimestamp) {
					logChannel.send(`${update["playerName"]} quit.`);
					latestChatTimestamp = update["timestamp"];
				}
			}

			if (update["type"] == "playerjoin") {
				if (update["timestamp"] > latestChatTimestamp) {
					logChannel.send(`${update["playerName"]} joined.`);
					latestChatTimestamp = update["timestamp"];
				}
			}
		}
	}, 1000);
});

client.login(process.env["DISCORD_BOT_TOKEN"]);
