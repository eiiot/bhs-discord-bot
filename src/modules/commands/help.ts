export default {
  name: "help",
  description: "Learn more about the bot, and the server",
  options: [],
  execute: async (interaction, client, app) => {
    const helpEmbed = {
      color: 0xeff624,
      title: "Berkeley High Discord!",
      description:
        "Hello, and welcome to the Berkeley High Discord!\n\nHere, you can chat with friends, get help with homework, and more!\n\nI'm the BHS Discord Bot, and I'm here to help out! You can see a list of avalible commands by typing `/`.",
      thumbnail: {
        url: "https://cdn.discordapp.com/icons/865312044068634634/7beb3fce0696960ff406cc34ef2a2338.webp?size=256",
      },
      timestamp: new Date(),
    };

    await interaction.reply({
      embeds: [helpEmbed],
    });
  },
  permissions: [
    // {
    //   id: "", // the id of the role, or the id of the user
    //   type: "", // ROLE or USER
    //   permission: "", // true or false (if true, the user or role has the permission)
    // },
  ],
};
