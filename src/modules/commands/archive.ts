export default {
  name: "archive",
  description: "Archive the current channel",
  options: [
    // {
    //   name: "", // the name of the option
    //   type: "", // STRING, INTEGER, BOOLEAN, USER, CHOICE
    //   description: "", // the description of the option
    //   required: true, // if the option is required for the command to execute
    // },
  ],
  execute: async (interaction, client, app) => {
    const channel = interaction.channel;
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

    await interaction.channel.setParent("819750695380975616", {
      lockPermissions: true,
    });
  },
  permissions: [
    {
      id: "762720121205555220", // the id of the role, or the id of the user
      type: "ROLE", // ROLE or USER
      permission: false, // true or false (if true, the user or role has the permission)
    },
  ],
};
