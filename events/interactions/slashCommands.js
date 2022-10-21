const { ChatInputCommandInteraction } = require("discord.js");
const { moderatorRole } = require("../../config.json");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    // if command is not a slash command, return
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });

    if (
      command.developer &&
      interaction.member.roles.cache.every((role) => role.id !== moderatorRole)
    )
      return interaction.reply({
        content: "You do not have permission to use this command!",
        ephemeral: true,
      });

    command.execute(interaction, client);
  },
};
