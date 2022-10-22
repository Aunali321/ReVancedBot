const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const { loadEvents } = require("./handlers/eventHandler.js");
const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.config = require("./config.json");
client.configCredentials = require("./config-credentials.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

const { connect } = require("mongoose");
connect(client.configCredentials.databaseURL, {}).then(() => {
  console.log("Connected to MongoDB");
});

loadEvents(client);

client.login(client.configCredentials.token);
