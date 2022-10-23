const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song")
    .addStringOption((options) =>
      options
        .setName("song")
        .setDescription("The song to play")
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { options, guild } = interaction;
    const song = options.getString("song");
    const member = guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;

    interaction.deferReply("");

    const errorEmbed = new EmbedBuilder()
      .setTitle("Error")
      .setColor("Red")
      .setFooter({
        text: `${client.user.username}`,
        iconURL: `${client.user.defaultAvatarURL}`,
      })
      .setTimestamp();

    const playingEmbed = new EmbedBuilder()
      .setTitle("Added to queue")
      .setColor("Green")
      .setFooter({
        text: `${client.user.username}`,
        iconURL: `${client.user.defaultAvatarURL}`,
      })
      .setTimestamp();

    if (!voiceChannel)
      return interaction.editReply({
        embeds: [errorEmbed.setDescription("You must be in a voice channel")],
      });

    try {
      await client.distube.play(voiceChannel, song, {
        member: member,
        textChannel: member.channel,
        message,
      });
      await interaction.editReply({
        embeds: [
          playingEmbed
            .setDescription(
              `Playing ${song}` + " "`${voiceChannel.name}`,
              `Requested by ${member.user.username}`
            )
            .setThumbnail(song.thumbnail),
        ],
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        content: `An error occurred: ${error}`,
        ephemeral: true,
      });
    }
  },
};
