import axios from "axios";

export default {
  name: "leaderboard",
  description: "Display the server's MEE6 leaderboard",
  options: [
    // {
    //   name: "", // the name of the option
    //   type: "", // STRING, INTEGER, BOOLEAN, USER, CHOICE
    //   description: "", // the description of the option
    //   required: true, // if the option is required for the command to execute
    // },
  ],
  execute: async (interaction, client, app) => {
    axios
      .get(
        `https://mee6.xyz/api/plugins/levels/leaderboard/${interaction.guild.id}`
      )
      .then(function (response) {
        const responseArray = response.data;
        const playersArray = responseArray.players;

        // format an embed with the leaderboard information
        let leaderboardDescription = "";
        for (let i = 0; i < 15 && i < playersArray.length; i++) {
          leaderboardDescription += `${i + 1}. <@${
            playersArray[i].id
          }> - **Level ${playersArray[i].level}** - *${
            playersArray[i].message_count
          } messages*\n`;
        }

        const embed = {
          color: 0xeff624,
          title: "Leaderboard",
          description: leaderboardDescription,
          timestamp: new Date(),
        };

        // // link to mee6 leaderboard
        // const row = new Discord.MessageActionRow().addComponents(
        //   new Discord.MessageButton()
        //     .setLabel(`View Leaderboard`)
        //     .setStyle("LINK")
        //     .setURL(`https://mee6.xyz/leaderboard/762412666521124866`)
        // );

        interaction.reply({
          embeds: [embed],
          // components: [row],
        });
      })
      .catch(function (err) {
        console.log(err);

        const embed = {
          color: 0xeff624,
          title: "Leaderboard",
          description: `An error occurred while fetching the leaderboard.`,
          timestamp: new Date(),
        };

        interaction.reply({
          embeds: [embed],
        });
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
