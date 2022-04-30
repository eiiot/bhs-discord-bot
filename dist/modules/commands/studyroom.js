export default {
    name: "studyroom",
    description: "Create a study room",
    options: [
        {
            name: "userlimit",
            description: `The maximum number of users allowed in the studyroom`,
            required: false,
            type: "INTEGER",
        },
    ],
    execute: async (interaction, client, app) => {
        let users = interaction.options.get("userlimit");
        let guild = interaction.guild;
        let member = await guild.members.fetch(interaction.user.id);
        // create a new voice channel
        const channel = await guild.channels.create(`${member.nickname}'s Study Room`, {
            type: "GUILD_VOICE",
            topic: `Created by ${interaction.user.username}`,
            parent: "762757482274881536",
            userLimit: users ? users.value : 50,
        });
        const embed = {
            color: 0xeff624,
            title: "Created a Study Room!",
            description: `Created the channel <#${channel.id}>. This channel will automatically be deleted when the last user leaves.`,
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
