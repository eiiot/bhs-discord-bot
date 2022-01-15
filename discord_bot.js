import Discord from 'discord.js';
import express from 'express';
import admin from 'firebase-admin';
import serviceAccountKey from './serviceAccountKey.js';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import axios from 'axios';
import fs from 'fs';
import {
  ShlinkClient
} from 'shlink-client';
const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING"
  ],
  partials: [
    "MESSAGE",
    "CHANNEL",
    "REACTION",
  ]
})

// ? SETUP IMPORTS ? //

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const shClient = new ShlinkClient({
  url: 'https://eliot.sh',
  token: process.env.SHLINK_TOKEN,
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const expressApp = express();

// ? OTHER FUNCTIONS ? //

// generatre a random string
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
};

// ? DISCORD BOT FUNCTIONS ? //

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // get guild 
  const guild = client.guilds.cache.get(`762412666521124866`);

  console.log(guild.name);

  // generate a webhook for #announcements
  async function verifyMessage() {
    const channel = client.guilds.cache.get(`762412666521124866`).channels.cache.get(`787039874384396329`);

    const embed = {
      color: 0xeff624,
      title: 'How to Verify for the BHS Discord!',
      description: "We verify users to make sure that every student who joins the BHS Discord is a BUSD student! Don't worry, verification is a simple process, that only takes ~1 minute.\n\n**Step 1:** Visit the link below! (If you're having issues, the link is https://auth.bhs.sh)\n**Step 2:** Follow the directions, and sign in with your BUSD email, and Discord account.\n**Step 3:** That's it! You're now verified. Enjoy the BHS Discord!\n\n*If you encounter any issues with the verification process, or would like to use a different name than the one specified on your Google account, please contact <@434013914091487232>*",
    };

    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setLabel(`Click Me!`)
        .setStyle('LINK')
        .setURL(`https://auth.bhs.sh`)
      );

    channel.send({
      embeds: [embed],
      components: [row]
    });
  };
  // get guild size


  client.user.setActivity(`Helping ${guild.memberCount} students!`, {
    type: 'PLAYING'
  });
});

// bot owner commands
client.on('messageCreate', async message => {
  if (!client.application?.owner) await client.application?.fetch();

  // block messages in a channel
  if (message.channel.id === '787039874384396329') return;

  const messageContent = message.content.split(" ");

  if (messageContent[0].toLowerCase() === '.deploy_slash_command' && message.author.id === client.application?.owner.id) {

    const data = {
      name: 'leaderboard',
      description: 'Mee6 xp leaderboard',
      // options: [
      //   {
      //   name: 'url',
      //   type: 'STRING',
      //   description: `URL to be shortened`,
      //   required: true
      //   },
      //   {
      //     name: 'slug',
      //     type: 'STRING',
      //     description: `A custom URL ending. Only available to teachers`,
      //     required: false
      // },
      // {
      //   name: 'action',
      //   type: 'STRING',
      //   description: `Action to preform on the user`,
      //   required: true,
      //   choices: [
      //     {
      //       name: 'Un-Verify',
      //       value: 'unverify',
      //     },
      //     {
      //       name: 'Verify',
      //       value: 'verify',
      //     },
      //     {
      //       name: 'Get Info',
      //       value: 'getinfo',
      //     },
      //   ],
      //   }                
      // ]
    };

    const command = await client.guilds.cache.get(message.guild.id)?.commands.create(data);
    console.log(command);
    message.reply(`Deployed your Slash Command: ${command.name}`);
  };

  if (messageContent[0].toLowerCase() === '.slash_command_id' && message.author.id === client.application?.owner.id) {
    if (messageContent.length < 2) {
      message.reply('Please use the following format: `.slash_command_id <command name>`');
      return;
    };

    const commands = await client.guilds.cache.get(message.guild.id)?.commands.fetch();

    // convert commands to array
    const commandArray = [...commands.entries()];
    console.log(commandArray);
    // find the command using the name
    const command = commandArray.find(command => command[1].name === messageContent[1]);

    console.log(command);

    // if command is not found reply with error

    if (command === undefined) {
      message.reply('Command not found');
      return;
    };

    message.reply("Slash Command ID: `" + command[0] + "`");
  };

  if (messageContent[0].toLowerCase() === '.react_with_heart' && message.author.id === client.application?.owner.id) {
    message.delete();

    console.log(messageContent[1]);

    var reactMessage = await message.channel.messages.fetch(messageContent[1]);
    console.log(reactMessage);

    reactMessage.react('❤️');
    reactMessage.reply('❤️');
  };

  if (message.content.startsWith('.slash_command_perms') && message.author.id === client.application?.owner.id) {
    const args = message.content.trim().split(' ');

    console.log(args);

    // check length of args
    if (args.length < 4) {
      message.reply('Please use the following format: `.slash_command_perms <command id> <true/false> <role id>`');
      return;
    };


    try {
      var commandId = args[1];
      var permissionString = args[2];
      var permission = (permissionString === 'true');
      var role = args[3];
    } catch (e) {
      message.reply('Please use the following format: `.slash_command_perms <command id> <true/false> <role id>`');
      return;
    };

    try {
      const command = await client.guilds.cache.get('762412666521124866')?.commands.fetch(commandId);
      const permissions = [{
        id: role,
        type: 'ROLE',
        permission: permission,
      }, ];

      await command.permissions.add({
        permissions
      })
    } catch (e) {
      message.reply('Please use the following format: `.slash_command_perms <command id> <true/false> <role id>`');
      return;
    };
  };

  //   if (message.content.startsWith('.firealarm') && message.author.id === client.application?.owner.id) {
  //     const args = message.content.trim().split(' ');
  //     const period = args[1];

  //     if (period == undefined) {
  //       message.reply('Please use the following format: `.firealarm <period>`');
  //       return;
  //     };

  //     const fireAlarms = JSON.parse(fs.readFileSync('fireAlarms.json'))

  //     fireAlarms.total++;

  //     fireAlarms.lastPull = Date.now();

  //     fireAlarms.periods[period]++;

  //     const lastPull = new Date(fireAlarms.lastPull);

  //     const embed = {
  //       color: 0xeff624,
  //       title: 'Fire Alarms',
  //       description: `**Total: ${fireAlarms.total}**
  //       \`\`\`Period 0: ${fireAlarms.periods[0]}
  // Period 1: ${fireAlarms.periods[1]}
  // Period 2: ${fireAlarms.periods[2]}
  // Period 3: ${fireAlarms.periods[3]}
  // Period 4: ${fireAlarms.periods[4]}
  // Period 5: ${fireAlarms.periods[5]}
  // Period 6: ${fireAlarms.periods[6]}
  // Period 7: ${fireAlarms.periods[7]}\`\`\``,
  //       timestamp: new Date(lastPull),
  //     };

  //     const webhook = new Discord.WebhookClient({ url: process.env.FIRE_ALARM_WEBHOOK });

  //     webhook.editMessage('900173448486191155', { embeds: [embed] });
  //     // webhook.send({ embeds: [embed] });

  //     fs.writeFileSync('fireAlarms.json', JSON.stringify(fireAlarms));
  // 	};

  if (messageContent[0].toLowerCase() === '.studyroom') {
    const embed = {
      color: 0xeff624,
      title: 'My Commands Have Moved!',
      description: "Try using `/studyroom`. Do `/help` for more information!",
      timestamp: new Date(),
    };

    message.reply({
      embeds: [embed]
    });
  };

  if (messageContent[0].toLowerCase() === '.help') {
    const embed = {
      color: 0xeff624,
      title: 'My Commands Have Moved!',
      description: "Try using `/help!`",
      timestamp: new Date(),
    };

    message.reply({
      embeds: [embed]
    });
  };

  if (messageContent[0].toLowerCase() === '!xp') {
    message.reply(`It's \`!rank\` <:nathan:837570945593638924>`);
  };

  if (messageContent[0].toLowerCase() === '!leaderboard') {
    message.reply(`It's \`/leaderboard\` <:nathan:837570945593638924>`);
  };

  if (messageContent[0].toLowerCase() === ',suggest') {
    const embed = {
      color: 0xeff624,
      title: 'The Suggest Command Has Moved!',
      description: "Try using `/suggest`!",
      timestamp: new Date(),
    };

    message.reply({
      embeds: [embed]
    });
  };

  if (message.mentions.has(client.user)) {
    message.react('👋');
  };

  if (messageContent[0].toLowerCase() === 'ping' && message.author.id === client.application?.owner.id) {
    // buttons row with one green button one red button

    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setCustomId('add_roles')
        .setLabel('Add Roles')
        .setStyle('PRIMARY'),
        new Discord.MessageButton()
        .setCustomId('remove_roles')
        .setLabel('Remove Roles')
        .setStyle('DANGER'),
      );

    const embed = {
      color: 0xeff624,
      title: 'Roles',
      description: `Click the buttons below to manage roles!`,
      timestamp: new Date(),
    };

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  };

  // mee6 level up messages ->
  if (message.author.id === '159985870458322944') {

    axios.get('https://mee6.xyz/api/plugins/levels/leaderboard/762412666521124866')
      .then(async function(response) {
        // convert json to array
        const responseArray = response.data;
        const playersArray = responseArray.players;

        for (let i = 0; i < playersArray.length; i++) {
          if (playersArray[i].level >= 10) {
            // find role by id
            const role = message.guild.roles.cache.find(role => role.id === '891136958951194717');

            const member = message.guild.members.cache.find(member => member.id === playersArray[i].id);

            // add role to user
            member.roles.add(role).catch((err) => {
              console.log(err)
            });
          } else if (playersArray[i].level < 10) {
            // find role by id
            const role = message.guild.roles.cache.find(role => role.id === '891136958951194717');

            const member = message.guild.members.cache.find(member => member.id === playersArray[i].id);

            // remove role from user
            member.roles.remove(role).catch((err) => {
              console.log(err)
            });
          };
        };
      }).catch(function(error) {
        console.log(error);
      });
  };

});

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {

    if (interaction.commandName === 'user') {
      const userOption = interaction.options.get('user');
      const user = userOption.user;
      const member = userOption.member;
      const actionOption = interaction.options.get('action');
      const author = interaction.user;
      var action = actionOption.value;

      // load database
      const emailsDatabase = JSON.parse(fs.readFileSync('./emails.json', 'utf8'));

      if (action === 'unverify') {
        if (member !== undefined) {
          if (!member.roles.cache.some(role => role.id === '762720121205555220')) {
            if (!member.roles.cache.some(role => role.id === '765670230747381790')) {
              const embed = {
                color: 0xeff624,
                title: 'Verification',
                description: `${user.tag} is not verified.`,
                timestamp: new Date(),
              };
              await interaction.reply({
                embeds: [embed],
                ephemeral: true
              });

              console.log(user.id);

              console.log(user.id);

              for (var i = 0; i < emailsDatabase.length; i++) {
                if (emailsDatabase[i].id == user.id) {
                  console.log('splicing');
                  emailsDatabase.splice(i, 1);
                };
              };

              console.log(emailsDatabase);

              // save database
              fs.writeFile('./emails.json', JSON.stringify(emailsDatabase), (err) => {
                if (err) {
                  console.error(err);
                }
              });

              return;
            } else {
              const embed = {
                color: 0xeff624,
                title: 'Verification',
                description: `${user.tag} is a teacher. Please unverify manually.`,
                timestamp: new Date(),
              };
              await interaction.reply({
                embeds: [embed],
                ephemeral: true
              });
              return;
            };
          };
          member.roles.remove('762720121205555220');

          const embed = {
            color: 0xeff624,
            title: 'User Unverified',
            description: `${user.tag} is no longer verified.`,
            timestamp: new Date(),
          };

          await interaction.reply({
            embeds: [embed],
            ephemeral: true
          });

          console.log(user.id);

          console.log(typeof user.id);

          if (user.id === "708428880121430137") {
            console.log('user verified');
          };

          // remove user from database
          for (var i = 0; i < emailsDatabase.length; i++) {
            if (emailsDatabase[i].id == user.id) {
              emailsDatabase.splice(i, 1);
              break;
            };
          };

          console.log(emailsDatabase);

          // save database
          fs.writeFile('./emails.json', JSON.stringify(emailsDatabase), (err) => {
            if (err) {
              console.error(err);
            };
          });

          const unverifyEmbed = {
            color: 0xeff624,
            title: 'You are no longer verified',
            description: `Please message <@434013914091487232> if you believe this was a mistake.`,
            timestamp: new Date(),
          };
          try {
            await user.send({
              embeds: [unverifyEmbed]
            });
          } catch (err) {
            console.log(err);
          };

        } else {
          // remove user from database
          for (var i = 0; i < emailsDatabase.length; i++) {
            if (emailsDatabase[i].id == user.id) {
              emailsDatabase.splice(i, 1);
              break;
            };
          };

          const embed = {
            color: 0xeff624,
            title: 'User Unverified',
            description: `${user.tag} is no longer verified.`,
            timestamp: new Date(),
          };

          await interaction.reply({
            embeds: [embed],
            ephemeral: true
          });

          const unverifyEmbed = {
            color: 0xeff624,
            title: 'You are no longer verified',
            description: `Please message <@434013914091487232> if you believe this was a mistake.`,
            timestamp: new Date(),
          };
          try {
            await user.send({
              embeds: [unverifyEmbed]
            });
          } catch (err) {
            console.log(err);
          };
        };
      };

      if (action == 'verify') {
        // add role to student
        member.roles.add('762720121205555220');

        // add student to database
        const newUser = {
          email: `Manually Verified by ${author.tag}`,
          id: user.id,
          date: new Date(),
        };
        emailsDatabase.push(newUser);

        // save database
        fs.writeFile('./emails.json', JSON.stringify(emailsDatabase), (err) => {
          if (err) {
            console.error(err);
          }
        });

        const embed = {
          color: 0xeff624,
          title: 'User Verified',
          description: `${user.tag} is now verified.`,
          timestamp: new Date(),
        };
        await interaction.reply({
          embeds: [embed],
          ephemeral: true
        });

        const verifyEmbed = {
          color: 0xeff624,
          title: 'Verification',
          description: `You have been verified!\nPlease change your nickname to your real first name using \`/nick {name}\`.\nThanks!`,
          timestamp: new Date(),
        };
        try {
          await user.send({
            embeds: [verifyEmbed]
          });
        } catch (err) {
          console.log(err);
        };
      };

      if (action === 'getinfo') {
        // find email by id in database
        const dbUser = emailsDatabase.find(object => object.id === user.id);

        console.log(dbUser);

        if (dbUser === undefined) {
          if (!member.roles.cache.some(role => role.id === '762720121205555220')) {
            if (!member.roles.cache.some(role => role.id === '765670230747381790')) {
              const embed = {
                color: 0xeff624,
                title: 'Verification',
                description: `<@${user.id}> is not verified.`,
                timestamp: new Date(),
              };
              await interaction.reply({
                embeds: [embed],
                ephemeral: true
              });
              return;
            };
          } else {
            const embed = {
              color: 0xeff624,
              title: 'User Info',
              description: `<@${user.id}> does not exist in the database.`,
              timestamp: new Date(),
            };
            await interaction.reply({
              embeds: [embed],
              ephemeral: true
            });
            return;
          };
        };

        const date = new Date(dbUser.date);
        if (dbUser) {
          const embed = {
            color: 0xeff624,
            title: 'User Email',
            description: `<@${user.id}>'s email is \`${dbUser.email}\`.\nUser's full name is \`${dbUser.name}\`\nUser was first verified on \`${date.toString()}\`\nUser Version is \`${dbUser.version}\``,
            timestamp: new Date(),
          };
          await interaction.reply({
            embeds: [embed],
            ephemeral: true
          });
        } else {
          const embed = {
            color: 0xeff624,
            title: 'User Email',
            description: `<@${user.id}> has not been verified.`,
            timestamp: new Date(),
          };
          await interaction.reply({
            embeds: [embed],
            ephemeral: true
          });
        };
      };
    };

    if (interaction.commandName === 'archive') {
      const channel = interaction.channel;
      const author = interaction.user;

      const embed = {
        color: 0xeff624,
        title: 'Channel Archived',
        description: `${channel.name} has been archived due to inactivity`,
        timestamp: new Date(),
        footer: {
          text: `Message ${author.tag} to appeal`
        }
      };
      await interaction.reply({
        embeds: [embed],
        ephemeral: false
      });

      // archive channel

      await interaction.channel.setParent('819750695380975616', {
        lockPermissions: true
      });
    };

    //?? make sure slash command is not in #verify
    if (interaction.channel.id == '787039874384396329') return;

    if (interaction.commandName === 'help') {
      const helpEmbed = {
        color: 0xeff624,
        title: 'Berkeley High Discord!',
        description: "Hello, and welcome to the Berkeley High Discord!\n\nHere, you can chat with friends, get help with homework, and more!\n\nI'm the BHS Discord Bot, and I'm here to help out! You can see a list of avalible commands by typing `/`.",
        thumbnail: {
          url: 'https://cdn.discordapp.com/icons/865312044068634634/7beb3fce0696960ff406cc34ef2a2338.webp?size=256',
        },
        timestamp: new Date(),
      };

      await interaction.reply({
        embeds: [helpEmbed]
      });
    };

    if (interaction.commandName === 'studyroom') {
      var users = interaction.options.get('users');
      var guild = interaction.guild;
      var member = await guild.members.fetch(interaction.user.id);

      console.log(member);

      console.log(users);
      // create a new voice channel

      // create an empty array
      const voiceChannel = [];

      async function createChannel() {
        if (users === undefined) {
          const channel = await guild.channels.create(`${member.nickname}'s Study Room`, {
            type: 'GUILD_VOICE',
            topic: `Created by ${interaction.user.username}`,
            parent: '762757482274881536',
          })
          return channel;
        } else {
          const channel = await guild.channels.create(`${member.nickname}'s Study Room`, {
            type: 'GUILD_VOICE',
            topic: `Created by ${interaction.user.username}`,
            parent: '762757482274881536',
            userLimit: users.value
          })
          return channel;
        };
      };

      const createdChannel = await createChannel();

      console.log(createdChannel);

      const embed = {
        color: 0xeff624,
        title: 'Created a Study Room!',
        description: `Created the channel <#${createdChannel.id}>`,
        timestamp: new Date(),
      };

      await interaction.reply({
        embeds: [embed]
      });
    };

    if (interaction.commandName === 'map') {
      const embed = {
        color: 0xeff624,
        title: 'Berkeley High Map',
        description: `This interactive map of Berkeley High is a digital version of the map available on the BHS website.`,
        footer: {
          text: 'Created by Eliot'
        }
      };

      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
          .setLabel(`Visit the Map!`)
          .setStyle('LINK')
          .setURL(`https://bhsmap.com`)
        );

      interaction.reply({
        embeds: [embed],
        components: [row]
      });
    };

    if (interaction.commandName === 'suggest') {
      var suggestion = interaction.options.get('suggestion').value;

      const member = await interaction.guild.members.fetch(interaction.user.id);

      const embed = {
        color: 0xeff624,
        thumbnail: {
          url: interaction.user.avatarURL(),
        },
        title: member.nickname,
        description: suggestion,
        timestamp: new Date(),
      };

      const channel = await interaction.guild.channels.fetch('839965498291519538');

      const suggestionMsg = await channel.send({
        embeds: [embed]
      });

      suggestionMsg.react(interaction.guild.emojis.cache.get('879376341613568040'));
      suggestionMsg.react(interaction.guild.emojis.cache.get('879376341630341150'));

      // start thread from message

      suggestionMsg.startThread({
        name: suggestion.substring(0, 99),
        autoArchiveDuration: 4320,
        reason: suggestion
      });

      const replyEmbed = {
        color: 0xeff624,
        title: 'Suggestion Submitted!',
        description: `Your suggestion has been submitted! You can view it in <#839965498291519538>`,
        timestamp: new Date(),
      };

      interaction.reply({
        embeds: [replyEmbed]
      });
    };

    if (interaction.commandName === 'stats') {
      // server statistics
      const server = interaction.guild;
      const memberCount = server.memberCount;
      // get number of users with "Teacher" Role
      const teacherCount = server.roles.cache.get('765670230747381790').members.size;
      // get number of users with "Student" Role
      const studentCount = server.roles.cache.get('762720121205555220').members.size;
      const botCount = server.members.cache.filter(member => member.user.bot).size;
      const channelCount = server.channels.cache.size;
      const roleCount = server.roles.cache.size;
      const emojiCount = server.emojis.cache.size;
      const createdAt = server.createdAt;

      const embed = {
        color: 0xeff624,
        title: 'Server Statistics',
        description: `
        **Member Count:** ${memberCount}

        **Teacher Count:** ${teacherCount}
        **Student Count:** ${studentCount-teacherCount}      
        **Bot Count:** ${botCount}

        **Channel Count:** ${channelCount}
        **Role Count:** ${roleCount}
        **Emoji Count:** ${emojiCount}
        
        **Created At:** ${createdAt}
        `,
        timestamp: new Date(),
      };

      await interaction.reply({
        embeds: [embed]
      });
    };

    if (interaction.commandName === 'leaderboard') {

      axios.get('https://mee6.xyz/api/plugins/levels/leaderboard/762412666521124866').then(function(response) {
        const responseArray = response.data;
        const playersArray = responseArray.players;

        // format an embed with the leaderboard information
        var leaderboardDescription = '';
        for (var i = 0; i < 15 && i < playersArray.length; i++) {
          leaderboardDescription += `${i+1}. <@${playersArray[i].id}> - **Level ${playersArray[i].level}** - *${playersArray[i].message_count} messages*\n`;
        };

        const embed = {
          color: 0xeff624,
          title: 'Leaderboard',
          description: leaderboardDescription,
          timestamp: new Date(),
        };

        // link to mee6 leaderboard
        const row = new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
            .setLabel(`View Leaderboard`)
            .setStyle('LINK')
            .setURL(`https://mee6.xyz/leaderboard/762412666521124866`)
          );

        interaction.reply({
          embeds: [embed],
          components: [row]
        });
      }).catch(function(error) {
        console.log(error);
      });
    }

    if (interaction.commandName === 'short') {
      // if user has blacklist role then don't allow them to use this command
      if (interaction.member.roles.cache.has('894096571845730345')) {
        const embed = {
          color: 0xeff624,
          title: 'Blacklisted',
          description: `You are blacklisted from using this command.`,
          timestamp: new Date(),
        };

        interaction.reply({
          embeds: [embed]
        });
      } else {
        await interaction.deferReply();
        try {
          var url = interaction.options.get('url').value;
          var slug = interaction.options.get('slug');
          console.log(slug);
          var user = interaction.user;
          var member = await interaction.guild.members.fetch(interaction.user.id);

          // check if url has https:// or http://, if it doesn't add https://
          if (url.substring(0, 7) != 'http://' && url.substring(0, 8) != 'https://') {
            url = 'https://' + url;
          };

          console.log(url);

          if (slug !== null && slug !== undefined) {
            var slug = slug.value;
            // check if user has teacher role or admin role
            if (member.roles.cache.has('765670230747381790') || member.roles.cache.has('762901377055588363') || member.roles.cache.has('765747696715038740')) {
              // create a new short URL
              const generatedURL = await shClient.createShortUrl({
                longUrl: url,
                customSlug: slug,
                domain: 'bhs.sh',
                tags: ['bhs-discord', `DiD(${user.id})`],
                findIfExists: true
              })

              console.log(generatedURL);

              const embed = {
                color: 0xeff624,
                title: 'Shortened URL',
                thumbnail: {
                  url: `${generatedURL.shortUrl}/qr-code?size=300&format=png.png`
                },
                description: `Your shortened URL is: \`${generatedURL.shortUrl}\`
                Click the button below to open the link in your browser`,
                timestamp: new Date(),
              };

              const row = new Discord.MessageActionRow()
                .addComponents(
                  new Discord.MessageButton()
                  .setLabel(generatedURL.shortUrl)
                  .setStyle('LINK')
                  .setURL(generatedURL.shortUrl)
                );

              interaction.editReply({
                embeds: [embed],
                components: [row]
              });
            } else {
              const embed = {
                color: 0xeff624,
                title: 'Shortened URL',
                description: `Sorry! For now, only teachers and server boosters can create custom short URLs D:`,
                timestamp: new Date(),
              };

              interaction.editReply({
                embeds: [embed]
              });
            };
          } else {
            // create a new short URL
            const generatedURL = await shClient.createShortUrl({
              longUrl: url,
              domain: 'bhs.sh',
              tags: ['bhs-discord', `DiD(${user.id})`],
              findIfExists: true
            });

            console.log(generatedURL);

            const embed = {
              color: 0xeff624,
              title: 'Shortened URL',
              // author photo
              thumbnail: {
                url: `${generatedURL.shortUrl}/qr-code?size=300&format=png.png`
              },
              description: `Your shortened URL is: \`${generatedURL.shortUrl}\`
              Click the button below to open the link in your browser`,
              timestamp: new Date(),
            };

            const row = new Discord.MessageActionRow()
              .addComponents(
                new Discord.MessageButton()
                .setLabel(generatedURL.shortUrl)
                .setStyle('LINK')
                .setURL(generatedURL.shortUrl)
              );

            interaction.editReply({
              embeds: [embed],
              components: [row]
            });
          };
        } catch (err) {
          console.log(err);
          const embed = {
            color: 0xeff624,
            title: 'Shortened URL',
            description: `Sorry! Something went wrong D:`,
            timestamp: new Date(),
          };

          interaction.editReply({
            embeds: [embed]
          });
          return;
        };
      };
    };

  };

  if (interaction.isButton()) {
    const roleMenu = [{
        label: 'Announcements',
        description: 'Get mentioned for smaller server announcements!',
        value: 'role_838895314814763079',
      },
      {
        label: 'Tutor',
        description: 'Help tutor others! You will be pinged',
        value: 'role_762755031232938075',
      },
      {
        label: 'Freshman',
        description: 'For BHS Freshmen',
        value: 'role_879182310073847868',
      },
      {
        label: 'Sophomore',
        description: 'For BHS Sophomores',
        value: 'role_879182331309588540',
      },
      {
        label: 'Junior',
        description: 'For BHS Juniors',
        value: 'role_879182350397894686',
      },
      {
        label: 'Senior',
        description: 'For BHS Seniors',
        value: 'role_879182364977274900',
      },
      {
        label: 'she/her',
        description: 'For those who use she/her pronouns',
        value: 'role_880531092359225405',
      },
      {
        label: 'he/him',
        description: 'For those who use he/him pronouns',
        value: 'role_880531048679743568',
      },
      {
        label: 'they/them',
        description: 'For those who use they/them pronouns',
        value: 'role_880531201268514866',
      },
      {
        label: 'Archive',
        description: 'View archived channels',
        value: 'role_892964728287145984',
      },
    ];


    if (interaction.customId === 'add_roles') {
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageSelectMenu()
          .setCustomId('role_add')
          .setPlaceholder('Nothing selected')
          .setMinValues(1)
          .addOptions(roleMenu),
        );
      interaction.reply({
        content: 'Please select the appropriate roles!',
        ephemeral: true,
        components: [row]
      });
    };

    if (interaction.customId === 'remove_roles') {
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageSelectMenu()
          .setCustomId('role_remove')
          .setPlaceholder('Nothing selected')
          .setMinValues(1)
          .addOptions(roleMenu),
        );
      interaction.reply({
        content: 'Please select the appropriate roles to remove!',
        ephemeral: true,
        components: [row]
      });
    };
  };

  if (interaction.isSelectMenu()) {
    if (interaction.customId.startsWith('role')) {
      // remove "role_" from string
      const roleType = interaction.customId.substring(5);
      if (roleType === 'add') {
        interaction.values.forEach(function(value) {
          // remove first 5 chars from string
          interaction.member.roles.add(value.slice(5));
        });
        await interaction.update({
          content: 'Roles added!',
          ephemeral: true,
          components: []
        });
      };

      if (roleType === 'remove') {
        interaction.values.forEach(function(value) {
          // remove first 5 chars from string
          interaction.member.roles.remove(value.slice(5));
        });
        await interaction.update({
          content: 'Roles removed!',
          ephemeral: true,
          components: []
        });
      };
    };
  };
});

// delete empty voice channels in a category
client.on('voiceStateUpdate', async (oldState, newState) => {
  // check if oldState.channel is not null
  if (oldState.channel != null) {
    if (oldState.channel.parentId == '762757482274881536') {
      if (oldState.channel.members.size === 0) {
        await oldState.channel.delete();
      }
    }
  }
});

// log on user join
client.on('guildMemberAdd', async (member) => {
  const guild = member.guild;
  const adminChannel = await guild.channels.fetch('877376896311132210');
  const user = member.user;
  const embed = {
    color: 0xeff624,
    title: 'Member Joined',
    description: `<@${user.id}> has joined the server!`,
    timestamp: new Date(),
  };

  const welcomeEmbed = {
    color: 0xeff624,
    title: 'How to Verify for the BHS Discord!',
    description: "We verify users to make sure that every student who joins the BHS Discord is a BUSD student! Don't worry, verification is a simple process, that only takes ~1 minute.\n\n**Step 1:** Visit the link below! (If you're having issues, the link is https://auth.bhs.sh)\n**Step 2:** Follow the directions, and sign in with your BUSD email, and Discord account.\n**Step 3:** That's it! You're now verified. Enjoy the BHS Discord!\n\n*If you encounter any issues with the verification process, or would like to use a different name than the one specified on your Google account, please contact <@434013914091487232>*",
  };

  const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
      .setLabel(`Click Me!`)
      .setStyle('LINK')
      .setURL(`https://auth.bhs.sh`)
    );

  member.send({
    embeds: [welcomeEmbed],
    components: [row]
  });

  await adminChannel.send({
    embeds: [embed]
  });
});

// log on user leave, and remove from emails DB
client.on('guildMemberRemove', async (member) => {
  const guild = member.guild;
  const adminChannel = await guild.channels.fetch('877376896311132210');
  const user = member.user;
  const embed = {
    color: 0xeff624,
    title: 'Member Left',
    description: `<@${user.id}> has left the server!`,
    timestamp: new Date(),
  };
  await adminChannel.send({
    embeds: [embed]
  });

  const emailsDatabase = JSON.parse(fs.readFileSync('./emails.json', 'utf8'));

  for (var i = 0; i < emailsDatabase.length; i++) {
    if (emailsDatabase[i].id == user.id) {
      console.log('splicing');
      emailsDatabase.splice(i, 1);
    };
  };

  // write to file
  fs.writeFile('./emails.json', JSON.stringify(emailsDatabase), (err) => {
    if (err) console.log(err);
  });
});

// message reaction add
client.on('messageReactionAdd', async (reaction, user) => {
  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);

  if (reaction.message.channel.id == '839965498291519538') {
    if (reaction.emoji.name == '🏁' || reaction.emoji.name == '🚫') {
      if (member.roles.highest.position >= guild.roles.cache.get('762719721472655430').position) {
        // archive the thread
        reaction.message.thread.setArchived(true);
      };
    };
  };
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
  const guild = newPresence.guild;
  const member = newPresence.member;

  client.user.setActivity(`Helping ${guild.memberCount} students!`, {
    type: 'PLAYING'
  });
});

client.login(process.env.BOT_TOKEN);

// ? WEB API & EXPRESS ? //

const expressServer = expressApp.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${expressServer.address().port}`);
});

// on request recieved validate discord + google token
expressApp.get('/discord', async (req, res) => {
  try {
    console.log('New Request')

    var discordCode = req.query.discordCode;
    var googleToken = req.query.googleToken;

    console.log({
      discordCode,
      googleToken
    })

    // validate google token
    const decodedToken = await admin.auth().verifyIdToken(googleToken);

    var userEmail = decodedToken.email;
    var userName = decodedToken.name;

    // validate discord token
    let data = `client_id=${process.env.DISCORD_CLIENT_ID}&client_secret=${process.env.DISCORD_CLIENT_SECRET}&grant_type=authorization_code&code=${discordCode}&redirect_uri=https://auth.bhs.sh`;

    const discordToken = await axios.post('https://discord.com/api/v8/oauth2/token', data, {
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // get user ID

    console.log(discordToken.data);

    const usersConfig = {
      headers: {
        Authorization: `Bearer ${discordToken.data.access_token}`
      }
    };

    const discordUser = await axios.get(`https://discord.com/api/v8/users/@me`, usersConfig);

    const discordUserID = discordUser.data.id;

    // check if email ends in berkeley.net

    if (!(userEmail.endsWith(".berkeley.net") || userEmail.endsWith("@berkeley.net"))) {
      throw new Error('invalid_email');
    };

    // check if user is already in database
    const emailsDatabase = JSON.parse(fs.readFileSync('./emails.json', 'utf8'));

    for (var i = 0; i < emailsDatabase.length; i++) {
      if (emailsDatabase[i].email === userEmail || emailsDatabase[i].id == discordUserID) {
        if (emailsDatabase[i].version >= 2.0 || emailsDatabase[i].id !== discordUserID) {
          throw new Error('user_exists');
        } else {
          // delete user from database
          emailsDatabase.splice(i, 1);
          // throw new Error('user_exists');
        };
      };
    };

    // otherwise verify user and add to database
    const member = await client.guilds.cache.get('762412666521124866').members.fetch(discordUserID);
    member.roles.add('762720121205555220');

    if (userEmail.endsWith('@berkeley.net')) {
      member.roles.add('765670230747381790');
    };

    console.log('Changing Username');

    const userNickname = await member.setNickname(userName);

    console.log(`Changed nickname to ${userNickname.nickname}`);

    const userObject = {
      id: discordUserID,
      email: userEmail,
      name: userName,
      date: new Date(),
      version: 2.0
    };

    emailsDatabase.push(userObject);

    // write to file

    fs.writeFile('./emails.json', JSON.stringify(emailsDatabase), (err) => {
      if (err) console.log(err);
    });

    const logEmbed = {
      color: 0xeff624,
      title: 'Verification',
      description: `<@${discordUserID}> was verified!`,
      timestamp: new Date(),
    };

    const adminChannel = await client.guilds.cache.get('762412666521124866').channels.fetch('877376896311132210');

    await adminChannel.send({
      embeds: [logEmbed]
    });

    // redirect user to /success using express
    res.redirect('https://auth.bhs.sh/success');
    return;
  } catch (err) {
    console.log(err);
    console.log(err.message);

    var errorType;

    if (err.message.toLowerCase().includes('request failed with status code')) {
      errorType = 'discord_error';
    } else if (err.message.toLowerCase().includes('firebase')) {
      errorType = 'google_error';
    } else if (err.message === 'invalid_email') {
      errorType = 'invalid_email';
    } else if (err.message === 'user_exists') {
      errorType = 'user_exists';
    } else {
      errorType = 'unknown_error';
    };

    console.log(errorType);

    res.redirect(`https://auth.bhs.sh/error?error=${errorType}`);
    return;
  };
});