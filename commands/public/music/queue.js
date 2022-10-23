const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Gets the music queue"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { guild } = interaction;
    const member = guild.members.cache.get(interaction.member.user.id);

    await interaction.deferReply("");

    const errorEmbed = new EmbedBuilder()
      .setTitle("Error")
      .setColor("Red")
      .setFooter({
        text: `${client.user.username}`,
        iconURL: `${client.user.defaultAvatarURL}`,
      })
      .setTimestamp();

    const queueEmbed = new EmbedBuilder()
      .setTitle("Queue")
      .setColor("Green")
      .setFooter({
        text: `${client.user.username}`,
        iconURL: `${client.user.defaultAvatarURL}`,
      })
      .setTimestamp();

    try {
      const queue = await client.distube.getQueue(guild);
      interaction.editReply({
        embeds: [
          queueEmbed.setDescription(
            "Current queue:\n" +
              queue.songs
                .map(
                  (song, id) =>
                    `**${id + 1}**. [${song.name}](${song.url}) - \`${
                      song.formattedDuration
                    }\``
                )
                .join("\n")
          ),
        ],
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [queueEmbed.setDescription("An error occurred \n" + error)],
      });
    }
  },
};
