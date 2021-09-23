const Discord = require('discord.js');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
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

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// generatre a random string
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
};


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`Helping BHS Students!`, { type: "PLAYING"});
});

client.on('guildMemberAdd', async member => {
  const embed = {
    color: 0xeff624,
    title: 'Welcome to the BHS Discord!',
    description: 'Please verify in <#787039874384396329> using \`/verify {email}\` to gain access to the server.\nAlso be sure to famaliarize yourself with the rules in <#838236356336943134>.\nThanks, and welcome!',
    timestamp: new Date(),
  };

  member.send({ embeds: [embed] });
});

// bot owner commands
client.on('messageCreate', async message => {
	if (!client.application?.owner) await client.application?.fetch();

  const messageContent = message.content.split(" ");

	if (messageContent[0].toLowerCase() === '.deploy_slash_command' && message.author.id === client.application?.owner.id) {

    const data = {
			name: 'suggest',
			description: 'Create a server suggestion!',
      options: [
        {
        name: 'suggestion',
        type: 'STRING',
        description: `Your suggestion`,
        required: true
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
        }                
      ]
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

		const command = await client.guilds.cache.get('762412666521124866')?.commands.fetch(commandId);
		const permissions = [
			{
				id: role,
				type: 'ROLE',
				permission: permission,
			},
		];

		await command.permissions.add({ permissions })
    .catch(err => {
      message.reply('Please use the following format: `.slash_command_perms <command id> <true/false> <role id>`');
      return;
    });
	};

  if (messageContent[0].toLowerCase() === '.studyroom') {
    const embed = {
      color: 0xeff624,
      title: 'My Commands Have Moved!',
      description: "Try using `/studyroom`. Do `/help` for more information!",
      timestamp: new Date(),
    };
    
    message.reply({ embeds: [embed] });
	};

  if (messageContent[0].toLowerCase() === '.help') {
    const embed = {
      color: 0xeff624,
      title: 'My Commands Have Moved!',
      description: "Try using `/help!`",
      timestamp: new Date(),
    };
    
    message.reply({ embeds: [embed] });
	};

  if (messageContent[0].toLowerCase() === '!xp') {
    message.reply(`It's \`!rank\` <:nathan:837570945593638924>`);
  };

  if (messageContent[0].toLowerCase() === '!leaderboard') {
    message.reply(`It's \`!levels\` <:nathan:837570945593638924>`);
  };

  if (messageContent[0].toLowerCase() === ',suggest') {
    const embed = {
      color: 0xeff624,
      title: 'The Suggest Command Has Moved!',
      description: "Try using `/suggest`!",
      timestamp: new Date(),
    };
    
    message.reply({ embeds: [embed] });
  };

  // content filters
  if (message.content.toLowerCase().includes('kill') && message.content.toLowerCase().includes('yourself')) {
    message.delete();

    const embed = {
      color: 0xeff624,
      title: 'Removed Message',
      description: `Removed \`1\` message from <@${message.author.id}>.\n**Message content**:\n\`${message.content}\``,
      timestamp: new Date(),
    };

    // get channel by id
    const adminChannel = await message.guild.channels.fetch('877376896311132210');
    adminChannel.send({ embeds: [embed] });
  };

  if (message.content.toLowerCase().includes('porn') || message.content.toLowerCase().includes('hentai')) {
    message.delete();
    const embed = {
      color: 0xeff624,
      title: 'Removed Message',
      description: `Removed \`1\` message from <@${message.author.id}>.\n**Message content**:\n\`${message.content}\``,
      timestamp: new Date(),
    };

    // get channel by id
    const adminChannel = await message.guild.channels.fetch('877376896311132210');
    adminChannel.send({ embeds: [embed] });
  };

  // end content filters

  if (messageContent[0].toLowerCase() === '.test_command_42' && message.author.id === client.application?.owner.id) {
    const user = message.author;
    const member = await message.guild.members.fetch(user.id);

    const embed = {
      color: 0xeff624,
      title: 'Verification',
      description: `Your verification code was correct!\nPlease change your nickname to your real first name using \`/nick {name}\`, and get the role for your grade in <#762755217057513503>.\nThanks!`,
      timestamp: new Date(),
    };
    await message.reply({embeds: [embed],  ephemeral: true });
  };

  if (message.channel.id === '879374919459303455' && !message.author.bot) {
    const member = await message.guild.members.fetch(message.author.id);

    if (messageContent[0].toLowerCase() === '.letmetype') {
      if (member.roles.cache.has('762719721472655430')) {
        return;
      } else {
        message.delete();
      };
    };

    const embed = {
      color: 0xeff624,
      author: {
        name: member.nickname,
        icon_url: message.author.avatarURL(),
      },
      title: 'Lecture Suggestion',
      description: message.content,
      timestamp: new Date(),
    };
    
    const replacedMessage = await message.channel.send({embeds: [embed]});

    message.delete();

    replacedMessage.react(message.guild.emojis.cache.get('879376341613568040'));
    replacedMessage.react(message.guild.emojis.cache.get('879376341630341150'));
  };

  if (message.mentions.has (client.user)) {
    message.react('👋');
  };
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  if (interaction.commandName === 'verify') {
    
    const user = interaction.user;
    const guild = interaction.guild;
    const channel = interaction.channel;
    const message = interaction.message;

    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };
    
    function validateBUSDEmail(email) {
      if (/berkeley.net\s*$/.test(email)) {
      return true;
      } else {
      return false;
      };
    };

    var emailOption = interaction.options.get('email');
    var email = emailOption.value.toLowerCase();

    if (interaction.channel.id !== '787039874384396329') {
      const embed = {
        color: 0xeff624,
        title: 'Verification',
        description: `You are already verified!`,
        timestamp: new Date(),
      };
      await interaction.reply({embeds: [embed],  ephemeral: true });
      return;
    };

    // validate email
    if (!validateEmail(email)) {
      const embed = {
        color: 0xeff624,
        title: 'Verification',
        description: `Invalid email!`,
        timestamp: new Date(),
      };
      await interaction.reply({embeds: [embed],  ephemeral: true });
      return;
    };

    // validate BUSDEmail
    if (!validateBUSDEmail(email)) {
      const embed = {
        color: 0xeff624,
        title: 'Verification',
        description: 'Please use your `berkeley.net` email!',
        timestamp: new Date(),
      };
      await interaction.reply({embeds: [embed],  ephemeral: true });
      return;
    };

    // check if email is a student or teacher!

    var emailDomain = email.split('@')[1];
    if (emailDomain == 'berkeley.net') {
      var role = '765670230747381790';
      var role2 = '762720121205555220';
      var twoRoles = true;
    } else  {
      var role = '762720121205555220';
    };

    console.log(role);

    // get database
    const emailsDatabase = JSON.parse(fs.readFileSync('./emails.json', 'utf8'));

    // check if email is in database
    console.log(emailsDatabase);

    for (var i = 0; i < emailsDatabase.length; i++) {
      if (emailsDatabase[i].email === email) {
        console.log(`${email} is in the database`);
        const embed = {
          color: 0xeff624,
          title: 'Verification',
          description: `This email is already verified!`,
          timestamp: new Date(),
        };
        await interaction.reply({embeds: [embed],  ephemeral: true });
        return;
      };
    };


    // chec if id is in database
    for (var i = 0; i < emailsDatabase.length; i++) {
      if (emailsDatabase[i].id === user.id) {
        console.log(`${user.id} is in the database`);
        const embed = {
          color: 0xeff624,
          title: 'Verification',
          description: `You are already verified!`,
          timestamp: new Date(),
        };
        await interaction.reply({embeds: [embed],  ephemeral: true });
        const member = await interaction.guild.members.fetch(user.id);
        await member.roles.add(role);
        return;
      };
    };

    // send user message asking for code
    const firstDMEmbed = {
      color: 0xeff624,
      title: 'Verification',
      description: `Please enter the verification code sent to your email. If you didn't recieve the email, check your spam folder.`,
      timestamp: new Date(),
    };

    const initialDM = await user.send({embeds: [firstDMEmbed]})
      .catch(async (err) => {
        console.log(err);
        const replyEmbed = {
          color: 0xeff624,
          title: 'Verification',
          description: `Please enable direct messages and re-verify.`,
          timestamp: new Date(),
        };
        await interaction.reply({embeds: [replyEmbed],  ephemeral: true });
        return;
      });

    const replyEmbed = {
      color: 0xeff624,
      title: 'Verification',
      description: `Please check your direct messages to continue the verification process!`,
      timestamp: new Date(),
    };
    
    await interaction.reply({embeds: [replyEmbed],  ephemeral: true })

    // send email to user
    let code = makeid(5);

    console.log(code);

    const msg = {
      to: `${email}`,
      from: {
          email: 'discord@bhs.eliothertenstein.com',
          name: 'Berkeley High Discord'
      },
      subject: 'Verify your Discord account!',
      text: `Hello! Your verification code is: ${code}.\nThis code will expire in 5 minutes!`,
      html: `Hello! Your verification code is: <strong>${code}</strong>.\nThis code will expire in 5 minutes!`,
    };

    sgMail.send(msg)
      .then(() => {}, error => {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
    });

    // wait for user to enter code

    console.log(`Waiting for user to enter code`);
    // console.log(initialDM);

    // wait for user to enter code

    initialDM.channel.awaitMessages({ max: 1, time: 300000, errors: ['time'] })
      .then(async (messages) => {
        const message = messages.first();
        const userCode = message.content;
        console.log(userCode);

        // check if code is correct
        if (userCode === code) {
          console.log(`Code is correct`);
          const embed = {
            color: 0xeff624,
            title: 'Verification',
            description: `Your verification code was correct!\nPlease change your nickname to your real first name using \`/nick {name}\`, and get the role for your grade in <#762755217057513503>.\nThanks!`,
            timestamp: new Date(),
          };
          await message.reply({embeds: [embed],  ephemeral: true });

          // add user to database
          const newUser = {
            email: email,
            id: user.id,
            date: new Date(),
          };

          emailsDatabase.push(newUser);
          console.log(emailsDatabase);

          // save database
          fs.writeFile('./emails.json', JSON.stringify(emailsDatabase), (err) => {
            if (err) {
              console.error(err);
            }
          });
          
          // add role to user

          console.log(user);

          const member = await interaction.guild.members.fetch(user.id);

          await member.roles.add(role);

          console.log(twoRoles);
          console.log(role2);

          if (twoRoles) {
            await member.roles.add(role2);
          };

          // log user verified

          const logEmbed = {
            color: 0xeff624,
            title: 'Verification',
            description: `<@${user.id}> was verified!`,
            timestamp: new Date(),
          };

          const adminChannel = await interaction.guild.channels.fetch('877376896311132210');
          
          await adminChannel.send({embeds: [logEmbed]});

          return;
        } else {
          console.log(`Code is incorrect`);
          const embed = {
            color: 0xeff624,
            title: 'Verification',
            description: `Your verification code was incorrect. Please verify again!`,
            timestamp: new Date(),
          };
          const tryAgainMessage = await message.reply({embeds: [embed],  ephemeral: true });
          return;
        };

      })
      .catch(async (error) => {
        console.log(error);
        const embed = {
          color: 0xeff624,
          title: 'Verification',
          description: `You took too long to reply. Please verify again!`,
          timestamp: new Date(),
        };
        await initialDM.reply({embeds: [embed],  ephemeral: true });
      });
  };

  if (interaction.commandName === 'user') {    
    const userOption = interaction.options.get('user');
    const user = userOption.user;
    const member = userOption.member;
    const actionOption = interaction.options.get('action');
    const author = interaction.user;
    action = actionOption.value;

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
            await interaction.reply({embeds: [embed],  ephemeral: true });

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
              description: `${user.tag} is a teacher. Removing two roles.`,
              timestamp: new Date(),
            };
            await interaction.reply({embeds: [embed],  ephemeral: true });
            member.roles.remove('765670230747381790');
          };
        };


        member.roles.remove('762720121205555220');

        const embed = {
          color: 0xeff624,
          title: 'User Unverified',
          description: `${user.tag} is no longer verified.`,
          timestamp: new Date(),
        };

        await interaction.reply({embeds: [embed],  ephemeral: true });

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
          await user.send({embeds: [unverifyEmbed]})
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

        await interaction.reply({embeds: [embed],  ephemeral: true });

        const unverifyEmbed = {
          color: 0xeff624,
          title: 'You are no longer verified',
          description: `Please message <@434013914091487232> if you believe this was a mistake.`,
          timestamp: new Date(),
        };

        try {
          await user.send({embeds: [unverifyEmbed]});
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
      await interaction.reply({embeds: [embed],  ephemeral: true });

      const verifyEmbed = {
          color: 0xeff624,
          title: 'Verification',
          description: `You have been verified!\nPlease change your nickname to your real first name using \`/nick {name}\`.\nThanks!`,
          timestamp: new Date(),
      };
      try {
        await user.send({embeds: [verifyEmbed]});
      } catch (err) {
        console.log(err);
      };
    };

    if (action === 'getinfo') {
      // find email by id in database
      const email = emailsDatabase.find(object => object.id === user.id);

      console.log(email);

      if (email === undefined) {
        if (!member.roles.cache.some(role => role.id === '762720121205555220')) {
          if (!member.roles.cache.some(role => role.id === '765670230747381790')) {
            const embed = {
              color: 0xeff624,
              title: 'Verification',
              description: `${user.tag} is not verified.`,
              timestamp: new Date(),
            };
            await interaction.reply({embeds: [embed],  ephemeral: true });
            return;
          };
        } else {
          const embed = {
            color: 0xeff624,
            title: 'User Info',
            description: `${user.tag} does not exist in the database.`,
            timestamp: new Date(),
          };
          await interaction.reply({embeds: [embed],  ephemeral: true });
          return;
        };
      };

      const date = new Date(email.date);
      if (email) {
        console.log(email);
        if (date !== undefined) {
          const embed = {
            color: 0xeff624,
            title: 'User Email',
            description: `**${user.tag}**'s email is **${email.email}**.\nUser was first verified on **${date.toString()}**`,
            timestamp: new Date(),
          };
          await interaction.reply({embeds: [embed],  ephemeral: true });
        } else {
          const embed = {
            color: 0xeff624,
            title: 'User Email',
            description: `**${user.tag}**'s email is **${email.email}**.\nDate is unavailable.`,
            timestamp: new Date(),
          };
          await interaction.reply({embeds: [embed],  ephemeral: true });
        };
      } else {
        const embed = {
          color: 0xeff624,
          title: 'User Email',
          description: `${user.tag} has not been verified.`,
          timestamp: new Date(),
        };
        await interaction.reply({embeds: [embed],  ephemeral: true });
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
    await interaction.reply({embeds: [embed],  ephemeral: false });

    // archive channel

    await interaction.channel.setParent('819750695380975616', { lockPermissions: true });
  };

  // make sure slash command is not in #verify
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

    await interaction.reply({ embeds: [helpEmbed] });
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

    await interaction.reply({ embeds: [embed] });
  };

  if (interaction.commandName === 'map') {
    const embed = {
      color: 0xeff624,
      url: 'https://www.bhsmap.com',
      title: 'Berkeley High Map',
      description: `An interactive map of Berkeley High is available at the link above!`,
      footer: {
        text: 'Created by Eliot'
      }
    };
    await interaction.reply({ embeds: [embed] });
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
    
    const suggestionMsg = await channel.send({embeds: [embed]});

    suggestionMsg.react(interaction.guild.emojis.cache.get('879376341613568040'));
    suggestionMsg.react(interaction.guild.emojis.cache.get('879376341630341150'));

    // start thread from message

    suggestionMsg.startThread({
      name: suggestion,
      autoArchiveDuration: 4320,
      reason: 'Suggestion Discussion'
    });

    const replyEmbed = {
      color: 0xeff624,
      title: 'Suggestion Submitted!',
      description: `Your suggestion has been submitted! You can view it in <#839965498291519538>`,
      timestamp: new Date(),
    };

    interaction.reply({ embeds: [replyEmbed] });
  };
});

// delete empty voice channels in a catagory
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
  await adminChannel.send({embeds: [embed]});
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
  await adminChannel.send({embeds: [embed]});

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

client.login(process.env.BOT_TOKEN);

// these are comments
// to make this
// code longer
// wow it's almost 1000 lines
// incredible
// wow
// wow
// wow
console.log('1000');