const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const { createWorker } = require("tesseract.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ocr")
    .setDescription("Reads text from an image")
    .addAttachmentOption((options) =>
      options.setName("image").setDescription("The image to read")
    )
    .addStringOption((option) =>
      option.setName("url").setDescription("The url of the image")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    interaction.deferReply();

    const textEmbed = new EmbedBuilder()
      .setTitle("Text")
      .setColor("Green")
      .setFooter({
        text: `${client.user.username}`,
        iconURL: `${client.user.defaultAvatarURL}`,
      })
      .setTimestamp();

    try {
      const { options } = interaction;
      const url = options.getString("url");
      const image = options.getAttachment("image");
      const worker = createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize(url || image.proxyURL);
      await worker.terminate();
      await interaction.editReply({
        embeds: [textEmbed.setDescription(text)],
      });
    } catch (error) {
      await interaction.editReply("Something went wrong!");
      console.error(error);
    }
  },
};
