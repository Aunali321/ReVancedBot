const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
} = require("discord.js");

const { SoundCloudPlugin } = require("@distube/soundcloud");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("scplay")
    .setDescription("Plays a song from SoundCloud")
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
      if (song.includes("soundcloud.com")) {
        // https://soundcloud.com/afterst0rm/in-house-we-trust
        search = song.replace("https://soundcloud.com/", "");
        search = search.replace("/", " ");
        search = search.replace("-", " ");
        search = await SoundCloudPlugin.search(search);
        search = search[0];
      } else {
        search = await SoundCloudPlugin.search(song);
        search = search[0];
      }
      await client.distube.play(voiceChannel, search, {
        member: member,
        textChannel: member.channel,
        metadata: { i: interaction },
      });
      interaction.editReply({
        embeds: [
          playingEmbed
            .setDescription(
              `Title: **${search.name}**
            URL: ${search.url}
            Duration: ${search.formattedDuration}`
            )
            .setThumbnail(search.thumbnail),
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
