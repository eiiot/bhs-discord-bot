export default {
  name: "stats",
  description: "View statistics about the server",
  options: [
    // {
    //   name: "", // the name of the option
    //   type: "", // STRING, INTEGER, BOOLEAN, USER, CHOICE
    //   description: "", // the description of the option
    //   required: true, // if the option is required for the command to execute
    // },
  ],
  execute: async (interaction, client, app) => {
    // server statistics
    const server = interaction.guild;
    const memberCount = server.memberCount;
    // get number of users with "Teacher" Role
    const teacherCount =
      server.roles.cache.get("765670230747381790").members.size;
    // get number of users with "Student" Role
    const studentCount =
      server.roles.cache.get("762720121205555220").members.size;
    const botCount = server.members.cache.filter(
      (member) => member.user.bot
    ).size;
    const channelCount = server.channels.cache.size;
    const roleCount = server.roles.cache.size;
    const emojiCount = server.emojis.cache.size;
    const createdAt = server.createdAt;

    const embed = {
      color: 0xeff624,
      title: "Server Statistics",
      description: `
        **Member Count:** ${memberCount}

        **Teacher Count:** ${teacherCount}
        **Student Count:** ${studentCount - teacherCount}      
        **Bot Count:** ${botCount}

        **Channel Count:** ${channelCount}
        **Role Count:** ${roleCount}
        **Emoji Count:** ${emojiCount}
        
        **Created At:** ${createdAt}
        `,
      timestamp: new Date(),
    };

    await interaction.reply({
      embeds: [embed],
    });
  },
  permissions: [
    // {
    //   id: "", // the id of the role, or the id of the user
    //   type: "", // ROLE or USER
    //   permission: "" // true or false (if true, the user or role has the permission)
    // }
  ],
};
