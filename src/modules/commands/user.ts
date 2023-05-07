// import {
//   ActionRowBuilder,
//   ButtonBuilder,
//   ButtonStyle,
//   PermissionFlagsBits,
// } from "discord.js";

// export default {
//   name: "user",
//   description: "Manage a guild member",
//   options: [
//     {
//       name: "user",
//       type: "USER",
//       description: `A guild member`,
//       required: true,
//     },
//     {
//       name: "action",
//       type: "STRING",
//       description: `Action to preform on the user`,
//       required: true,
//       choices: [
//         {
//           name: "Un-Verify",
//           value: "unverify",
//         },
//         {
//           name: "Verify",
//           value: "verify",
//         },
//         {
//           name: "Get Info",
//           value: "getinfo",
//         },
//         {
//           name: "Reset Nick",
//           value: "resetnick",
//         },
//       ],
//     },
//   ],
//   execute: async (interaction, client, app) => {
//     const userOption = interaction.options.get("user");
//     const user = userOption.user;
//     const member = userOption.member;
//     const action = interaction.options.get("action").value;
//     const author = interaction.user;

//     // load database
//     const db = app.firestore();

//     if (action === "unverify") {
//       // unverify user
//       if (member == undefined) {
//         // if the member does not exist
//         interaction.reply("This user is not a member of the server.");

//         return;
//       }

//       if (member.roles.cache.some((role) => role.id === "765670230747381790")) {
//         // if the member is a teacher
//         interaction.reply(
//           "This user is a teacher, and must be unverified manually."
//         );

//         return;
//       }

//       // remove from database

//       member.roles.remove("762720121205555220").catch((err) => {
//         console.log(err);

//         const embed = {
//           color: "#DC2626",
//           title: "Error",
//           description: `An error occurred while trying to remove the \`student\` role from ${member.displayName}.`,
//           timestamp: new Date(),
//         };

//         interaction.reply({
//           embeds: [embed],
//           ephemeral: true,
//         });
//       });

//       const doc = await db.collection("users").doc(user.id).get();

//       if (doc.exists) {
//         await db.collection("users").doc(user.id).delete();
//         const embed = {
//           color: "#22C55E",
//           title: "User unverified",
//           description: `${member.displayName} was removed from the database.`,
//           timestamp: new Date(),
//         };

//         await interaction.reply({
//           embeds: [embed],
//           ephemeral: true,
//         });

//         // dm the user
//         const dmChannel = await member.createDM();

//         const dmEmbed = {
//           color: "#22C55E",
//           title: "User unverified",
//           description: `You have been unverified in the BHS Discord server. Please contact <@!${author.id}> if you believe this was done in error.`,
//           timestamp: new Date(),
//         };

//         dmChannel
//           .send({
//             embeds: [dmEmbed],
//           })
//           .catch((err) => {
//             console.log(err);
//           });

//         return;
//       } else {
//         // remove the student role from the user anyways

//         member.roles
//           .remove("762720121205555220")
//           .then(() => {
//             // dm the user
//             const dmChannel = member.createDM();

//             const dmEmbed = {
//               color: "#22C55E",
//               title: "Request to reverify",
//               description: `You have been unverified in the BHS Discord server, as your account did not exist in the database. Dont worry! You can re-verify by visiting <#787039874384396329>, or clicking the button below.`,
//               timestamp: new Date(),
//             };

//             // create the button interaction
//             const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
//               new ButtonBuilder()
//                 .setStyle(ButtonStyle.Link)
//                 .setLabel("Reverify")
//                 .setURL(`https://auth.bhs.sh`)
//             );

//             dmChannel
//               .send({
//                 embeds: [dmEmbed],
//                 components: [row],
//               })
//               .catch((err) => {
//                 console.log(err);
//               });

//             const embed = {
//               color: "#DC2626",
//               title: "User unverified",
//               description: `${member.displayName} does not exist in the database. Their student role has been removed.`,
//               timestamp: new Date(),
//             };

//             interaction.reply({
//               embeds: [embed],
//               ephemeral: true,
//             });
//             return;
//           })
//           .catch((err) => {
//             console.log(err);

//             const embed = {
//               color: "#DC2626",
//               title: "Error",
//               description: `An error occurred while trying to remove the \`student\` role from ${member.displayName}.`,
//               timestamp: new Date(),
//             };

//             interaction.reply({
//               embeds: [embed],
//               ephemeral: true,
//             });

//             return;
//           });
//       }
//     }

//     if (action == "verify") {
//       // add role to student
//       member.roles.add("762720121205555220");

//       // add student to database
//       const newUser = {
//         email: `Manually Verified by ${author.tag}`,
//         id: user.id,
//         date: new Date(),
//         name: "Manually Verified",
//         version: 2,
//       };

//       db.collection("users")
//         .doc(user.id)
//         .set(newUser)
//         .then(() => {
//           const embed = {
//             color: "#22C55E",
//             title: "User verified",
//             description: `${member.displayName} was added to the database.`,
//             timestamp: new Date(),
//           };

//           interaction.reply({
//             embeds: [embed],
//             ephemeral: true,
//           });

//           const verifyEmbed = {
//             color: 0xeff624,
//             title: "Verification",
//             description: `You have been verified!\nPlease change your nickname to your real first name using \`/nick {name}\`.\nThanks!`,
//             timestamp: new Date(),
//           };

//           user
//             .send({
//               embeds: [verifyEmbed],
//             })
//             .catch((err) => console.error("Error sending PM: " + err));
//         })
//         .catch((err) => {
//           console.error(err);

//           const embed = {
//             color: "#DC2626",
//             title: "Error",
//             description: `An error occurred while trying to add ${member.displayName} to the database.`,
//             timestamp: new Date(),
//           };

//           interaction.reply({
//             embeds: [embed],
//             ephemeral: true,
//           });
//         });
//     }

//     if (action === "getinfo") {
//       // find email by id in database
//       console.log(user.id);

//       const dbQuery = await db.collection("users").doc(user.id).get();

//       console.log(dbQuery.data());

//       if (dbQuery.exists) {
//         const dbUser = dbQuery.data();

//         const date = new Date(dbUser.date);

//         const embed = {
//           color: 0xeff624,
//           title: "User Email",
//           description: `<@${user.id}>'s email is \`${
//             dbUser.email
//           }\`.\nUser's full name is \`${
//             dbUser.name
//           }\`\nUser was first verified on \`${date.toString()}\`\nUser Version is \`${
//             dbUser.version
//           }\``,
//           timestamp: new Date(),
//         };
//         await interaction.reply({
//           embeds: [embed],
//           ephemeral: true,
//         });
//       } else {
//         const embed = {
//           color: "#DC2626",
//           title: "Error",
//           description: `An error occurred while trying to find ${user.tag} in the database.`,
//           timestamp: new Date(),
//         };

//         await interaction.reply({
//           embeds: [embed],
//           ephemeral: true,
//         });
//       }
//     }

//     if (action === "resetnick") {
//       // get nickname from the database

//       const dbQuery = await db.collection("users").doc(user.id).get();

//       if (dbQuery.exists) {
//         const dbUser = dbQuery.data();

//         if (dbUser.name) {
//           member.setNickname(dbUser.name);

//           const embed = {
//             color: "#22C55E",
//             title: "Reset Nickname",
//             description: `${member.displayName}'s nickname was reset to \`${dbUser.name}\`.`,
//             timestamp: new Date(),
//           };

//           await interaction.reply({
//             embeds: [embed],
//             ephemeral: true,
//           });
//         } else {
//           const embed = {
//             color: "#DC2626",
//             title: "Error",
//             description: `${user.tag}'s nickname is \`undefined\``,
//             timestamp: new Date(),
//           };

//           await interaction.reply({
//             embeds: [embed],
//             ephemeral: true,
//           });
//         }

//         return;
//       } else {
//         const embed = {
//           color: "#DC2626",
//           title: "Error",
//           description: `An error occurred while trying to find ${user.tag} in the database.`,
//           timestamp: new Date(),
//         };

//         await interaction.reply({
//           embeds: [embed],
//           ephemeral: true,
//         });
//       }
//     }
//   },
//   permissions: PermissionFlagsBits.Administrator,
// };
