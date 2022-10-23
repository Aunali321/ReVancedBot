const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the music"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { guild } = interaction;
    const member = guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;

    await interaction.deferReply("");

    const errorEmbed = new EmbedBuilder()
      .setTitle("Error")
      .setColor("Red")
      .setFooter({
        text: `${client.user.username}`,
        iconURL: `${client.user.defaultAvatarURL}`,
      })
      .setTimestamp();

    const stopEmbed = new EmbedBuilder()
      .setTitle("Stopped")
      .setColor("Green")
      .setFooter({
        text: `${client.user.username}`,
        iconURL: `${client.user.defaultAvatarURL}`,
      })
      .setTimestamp();

    if (!voiceChannel)
      return interaction.editReply({
        embeds: [errorEmbed.setDescription("Not in a voice channel")],
      });

    try {
      client.distube.stop(guild);
      interaction.editReply({
        embeds: [stopEmbed.setDescription("Stopped music.")],
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [errorEmbed.setDescription("An error occurred \n" + error)],
      });
    }
  },
};
