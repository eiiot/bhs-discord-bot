import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
const data = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View statistics about the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);
export default {
    name: "stats",
    data,
    async execute(interaction) {
        // server statistics
        const server = interaction.guild;
        const memberCount = server.memberCount;
        // get number of users with "Teacher" Role
        const teacherCount = server.roles.cache.get("765670230747381790").members.size;
        // get number of users with "Student" Role
        const studentCount = server.roles.cache.get("762720121205555220").members.size;
        const botCount = server.members.cache.filter((member) => member.user.bot).size;
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
};
