const Discord = require('discord.js');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const client = new Discord.Client({
    intents: [
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_EMOJIS",
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

// client.on('debug', console.log);

// bot owner commands
client.on('messageCreate', async message => {
	if (!client.application?.owner) await client.application?.fetch();

  const messageContent = message.content.split(" ");

	if (messageContent[0].toLowerCase() === '.deploy_slash_command' && message.author.id === client.application?.owner.id) {

    const data = {
			name: 'verify',
			description: 'Verify your discord account!',
      options: [
        {
        name: 'email',
        type: 'STRING',
        description: `Your berkeley.net email`,
        required: true
        }                      
      ]
		};

		const command = await client.guilds.cache.get(message.guild.id)?.commands.create(data);
		console.log(command);
    message.reply(`Deployed your Slash Command`);
	}

  if (messageContent[0].toLowerCase() === '.studyroom' && message.author.id === client.application?.owner.id) {
    const embed = {
      color: 0xeff624,
      title: 'My Commands Have Moved!',
      description: "Try using `/studyroom`. Do `/help` for more information!",
      timestamp: new Date(),
    };
    
    message.reply({ embeds: [embed] });
	}

  if (messageContent[0].toLowerCase() === '.help' && message.author.id === client.application?.owner.id) {
    const embed = {
      color: 0xeff624,
      title: 'My Commands Have Moved!',
      description: "Try using `/help!`",
      timestamp: new Date(),
    };
    
    message.reply({ embeds: [embed] });
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  if (interaction.commandName === 'verify') {
    console.time('verify');
    
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
    var email = emailOption.value;

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
      var role = '765670230747381790'
    } else  {
      var role = '76272012120555522';
    };

    // get database
    var emailsJSON = fs.readFileSync('./emails.json', 'utf8');
    var emailsDatabase = JSON.parse(emailsJSON);

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

    console.timeEnd('verify');

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
            description: `Your verification code was correct! You are now verified.`,
            timestamp: new Date(),
          };
          await message.reply({embeds: [embed],  ephemeral: true });

          // add user to database
          const newUser = {
            email: email,
            id: user.id,
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

  // not #verify
  if (interaction.channel.id !== '787039874384396329') return;

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

    console.log(users);
    // create a new voice channel

    // create an empty array
    const voiceChannel = [];

    async function createChannel() {
      if (users === undefined) {
        const channel = await guild.channels.create(`${interaction.user.username}'s Study Room`, {
          type: 'GUILD_VOICE',
          topic: `Created by ${interaction.user.username}`,
          parent: '762757482274881536',
        })
        return channel;
      } else {
        const channel = await guild.channels.create(`${interaction.user.username}'s Study Room`, {
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

// get reaction
// client.on('messageReactionAdd', async (reaction, user) => {
//   if (reaction.message.id == '871048479139577866') {
//     if (reaction.emoji.name == 'strava_logo') {
//       const memberWhoReacted = await reaction.message.guild.members.fetch(user.id);
//       memberWhoReacted.roles.add('870756385804152863');
//       console.log(`Added role to ${user.username}`);
//     };
//   };
// });

// client.on('messageReactionRemove', async (reaction, user) => {
//   if (reaction.message.id == '871048479139577866') {
//     if (reaction.emoji.name == 'strava_logo') {
//       const memberWhoReacted = await reaction.message.guild.members.fetch(user.id);
//       memberWhoReacted.roles.remove('870756385804152863');
//       console.log(`Removed role from ${user.username}`);
//     };
//   };
// });

client.login(process.env.BOT_TOKEN);