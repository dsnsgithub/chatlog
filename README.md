# Dynmap Chatlog

A substitute for Discord-SRV, it bridges Minecraft and Discord chat.

## How To Install

### 1. Clone the Github Repository:

	git clone https://github.com/dsnsgithub/chatlog

### 2. Enter the repository and install dependencies:

	cd chatlog
	npm install

### 3. Create a `.env` file and add these properties:

	DYNMAP_IP = [link to the dynmap website (include port and full url)]

	CHANNEL_ID = [id from channel where you want to log chat messages]
	GUILD_ID = [id from guild where you want to log/send chat messages]

	DISCORD_BOT_TOKEN = [create a discord bot in the developer portal and add the token here]
	CLIENT_ID = [discord bot client id, found in discord developer portal] 

### 4. Register Discord Slash Commands:

    node deploy-commands.js

### 5. Run the Discord Bot:

    node .