const { Client } = require("discord.js");
const client = new Client({ intents: ["Guilds"] });

client.config = require("./config.json");
client.configToken = require("./config-token.json");

client
  .login(client.configToken.token)
  .then(() => {
    console.log(`Logged in as ${client.user.username}`);
    client.user.setActivity(`${client.config.prefix}help`, {
      type: "WATCHING",
    });
  })
  .catch((err) => console.error(err));
