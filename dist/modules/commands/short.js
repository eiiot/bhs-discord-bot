// import {
//   ActionRowBuilder,
//   ButtonBuilder,
//   ButtonStyle,
//   PermissionFlagsBits,
//   SlashCommandBuilder,
// } from "discord.js";
// import { ShlinkClient } from "shlink-client";
// import dotenv from "dotenv";
// dotenv.config();
// const shClient = new ShlinkClient({
//   url: "https://eliot.sh",
//   token: process.env.SHLINK_TOKEN,
// });
// const data = new SlashCommandBuilder()
//   .setName("short")
//   .setDescription("Create a bhs.sh short URL")
//   .addStringOption((option) =>
//     option
//       .setName("url")
//       .setDescription("URL to be shortened")
//       .setRequired(true)
//   )
//   .addStringOption((option) =>
//     option
//       .setName("slug")
//       .setDescription(
//         "A custom URL ending. Only available to teachers and server boosters"
//       )
//       .setRequired(false)
//   )
//   .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);
// export default {
//   data,
//   async execute(interaction) {
//     // if user has blacklist role then don't allow them to use this command
//     if (interaction.member.roles.cache.has("894096571845730345")) {
//       const embed = {
//         color: 0xeff624,
//         title: "Blacklisted",
//         description: `You are blacklisted from using this command.`,
//         timestamp: new Date(),
//       };
//       await interaction.reply({
//         embeds: [embed],
//       });
//       return;
//     }
//     await interaction.deferReply();
//     try {
//       let url = interaction.options.getString("url");
//       let slug = interaction.options.getString("slug");
//       let user = interaction.user;
//       let member = await interaction.guild.members.fetch(interaction.user.id);
//       // check if url has https:// or http://, if it doesn't add https://
//       if (
//         url.substring(0, 7) != "http://" &&
//         url.substring(0, 8) != "https://"
//       ) {
//         url = "https://" + url;
//       }
//       if (slug !== null && slug !== undefined) {
//         // check if user has teacher role or admin role
//         if (
//           member.roles.cache.has("765670230747381790") ||
//           member.roles.cache.has("762901377055588363") ||
//           member.roles.cache.has("765747696715038740")
//         ) {
//           // create a new short URL
//           const generatedURL = await shClient.createShortUrl({
//             longUrl: url,
//             customSlug: slug,
//             domain: "bhs.sh",
//             tags: ["bhs-discord", `DiD(${user.id})`],
//             findIfExists: true,
//           });
//           const embed = {
//             color: 0xeff624,
//             title: "Shortened URL",
//             thumbnail: {
//               url: `${generatedURL.shortUrl}/qr-code?size=300&format=png.png`,
//             },
//             description: `Your shortened URL is: \`${generatedURL.shortUrl}\`
//               Click the button below to open the link in your browser`,
//             timestamp: new Date(),
//           };
//           const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
//             new ButtonBuilder()
//               .setLabel(generatedURL.shortUrl)
//               .setStyle(ButtonStyle.Link)
//               .setURL(generatedURL.shortUrl)
//           );
//           await interaction.editReply({
//             embeds: [embed],
//             components: [row],
//           });
//         } else {
//           const embed = {
//             color: 0xeff624,
//             title: "Shortened URL",
//             description: `Sorry! For now, only teachers and server boosters can create custom short URLs D:`,
//             timestamp: new Date(),
//           };
//           await interaction.editReply({
//             embeds: [embed],
//           });
//         }
//       } else {
//         // create a new short URL
//         const generatedURL = await shClient.createShortUrl({
//           longUrl: url,
//           domain: "bhs.sh",
//           tags: ["bhs-discord", `DiD(${user.id})`],
//           findIfExists: true,
//         });
//         const embed = {
//           color: 0xeff624,
//           title: "Shortened URL",
//           thumbnail: {
//             url: `${generatedURL.shortUrl}/qr-code?size=300&format=png.png`,
//           },
//           description: `Your shortened URL is: \`${generatedURL.shortUrl}\`
//             Click the button below to open the link in your browser`,
//           timestamp: new Date(),
//         };
//         const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
//           new ButtonBuilder()
//             .setLabel(generatedURL.shortUrl)
//             .setStyle(ButtonStyle.Link)
//             .setURL(generatedURL.shortUrl)
//         );
//         await interaction.editReply({
//           embeds: [embed],
//           components: [row],
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       const embed = {
//         color: 0xeff624,
//         title: "Shortened URL",
//         description: `Sorry! Something went wrong D:`,
//         timestamp: new Date(),
//       };
//       await interaction.editReply({
//         embeds: [embed],
//       });
//       return;
//     }
//   },
// };
