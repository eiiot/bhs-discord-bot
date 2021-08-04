const Discord = require('discord.js');
const dotenv = require('dotenv');
const client = new Discord.Client({
    intents: [
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_BANS",
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
			name: 'studyroom',
			description: 'Create a study room.',
      options: [
        {
        name: 'users',
        type: 'INTEGER',
        description: `Limit users. Leave empty for no limit.`,
        required: false
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