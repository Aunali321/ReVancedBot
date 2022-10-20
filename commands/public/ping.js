const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */

  execute(interaction) {
    // reply with server latency
    interaction.reply(`Pong! - ${interaction.client.ws.ping}ms`);
  },
};
