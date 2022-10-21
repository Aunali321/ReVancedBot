const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
} = require("discord.js");

const { loadCommands } = require("../../handlers/commandHandler");
const { loadEvents } = require("../../handlers/eventHandler");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads the commands and events")
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
    .addSubcommand((options) =>
      options.setName("commands").setDescription("Reloads the commands")
    )
    .addSubcommand((options) =>
      options.setName("events").setDescription("Reloads the events")
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "commands":
        {
          loadCommands(client);
          interaction.reply("Commands reloaded!");
        }
        break;
      case "events":
        {
          for (const [key, value] of client.events)
            client.removeListener(`${key}`, value, true);
          loadEvents(client);
          interaction.reply("Events reloaded!");
        }
        break;
    }
  },
};
