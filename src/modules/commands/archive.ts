import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("archive")
  .setDescription("Archive the current channel")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to archive")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export default {
  name: "archive",
  data,
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const author = interaction.user;

    const embed = {
      color: 0xeff624,
      title: "Channel Archived",
      description: `${channel.name} has been manually archived by <@${author.id}>`,
      timestamp: new Date(),
    };

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });

    // archive channel

    await channel.setParent("819750695380975616", {
      lockPermissions: true,
    });
  },
};
