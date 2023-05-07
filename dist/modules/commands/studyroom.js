import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
const data = new SlashCommandBuilder()
    .setName("studyroom")
    .setDescription("Create a study room")
    .addIntegerOption((option) => option
    .setName("userlimit")
    .setDescription("The maximum number of users allowed in the study room")
    .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);
export default {
    name: "studyroom",
    data,
    async execute(interaction, client, app) {
        let userLimit = interaction.options.getInteger("userlimit");
        let guild = interaction.guild;
        let member = await guild.members.fetch(interaction.user.id);
        // create a new voice channel
        const channel = await guild.channels.create(`${member.nickname}'s Study Room`, {
            type: "GUILD_VOICE",
            topic: `Created by ${interaction.user.username}`,
            parent: "762757482274881536",
            userLimit: userLimit ? userLimit : 50,
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
};
