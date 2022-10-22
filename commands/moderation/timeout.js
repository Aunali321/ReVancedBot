const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
} = require("discord.js");

const ms = require("ms");
const database = require("../../schemas/infractions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeouts a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption((options) =>
      options
        .setName("user")
        .setDescription("The user to timeout")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("duration")
        .setDescription("The duration of the timeout (e.g. 1h, 1d, 1w)")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("The reason for the timeout")
        .setMaxLength(512)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { guild, member, options } = interaction;

    const user = options.getMember("user");
    const duration = options.getString("duration");
    const reason = options.getString("reason") || "No reason specified";

    const errorEmbed = new EmbedBuilder()
      .setTitle("Could not timeout user")
      .setColor("Red")
      .setTimestamp();
    const errors = [];

    if (!user) errors.push("User not found");

    if (!duration) errors.push("Duration not specified");

    if (user.id === member.id) errors.push("You can't timeout yourself");

    if (user.roles.highest.position >= member.roles.highest.position)
      errors.push("The user has a higher role than you");

    if (!ms(duration)) errors.push("Invalid duration");

    if (ms(duration) > ms("28d"))
      errors.push("Duration can't be greater than 28 days");

    if (!user.manageable || !user.manageable)
      errors.push("I can't timeout this user");

    if (errors.length) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription(errors.join("\n"))],
      });
    }

    let timeError = false;
    let error = "";
    await user.timeout(ms(duration), reason).catch((err) => {
      timeError = true;
      error = err;
      console.log(err);
    });

    if (timeError) {
      console.log(`An error occurred while timing out ${user.user.tag}`);
      return interaction.reply({
        embeds: [errorEmbed.setDescription("An error occurred" + "\n" + error)],
      });
    }

    const newInfraction = {
      issuerID: member.id,
      issuerTag: member.user.tag,
      reason: reason,
      date: Date.now(),
    };

    let userData = await database.findOne({ guild: guild.id, user: user.id });

    if (!userData) {
      userData = await database.create({
        guild: guild.id,
        user: user.id,
        username: user.user.tag,
        infractions: [newInfraction],
      });
    } else {
      userData.infractions.push(newInfraction);
      await userData.save();
    }

    const successEmbed = new EmbedBuilder()
      .setTitle(`Timed out ${user.user.tag}`)
      .setColor("Green")
      .setTimestamp()
      .setDescription(
        `${user} was timed out for **Duration:** ${ms(ms(duration), {
          long: true,
        })}\n** by:** ${member.user.tag},
        **Reason:** ${reason},
        **Total infractions:** ${userData.infractions.length}`
      )
      .setFooter({
        text: `${client.user.username}`,
        iconURL: `${client.user.defaultAvatarURL}`,
      });

    interaction.reply({ embeds: [successEmbed] });
  },
};
