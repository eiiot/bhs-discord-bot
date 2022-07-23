import Discord, { TextChannel } from "discord.js";
import dotenv from "dotenv";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccountKey from "../serviceAccountKey.js";

import {
  help,
  user,
  studyroom,
  stats,
  archive,
  leaderboard,
  short,
} from "./modules/commands";

import authServer from "./modules/authServer.js";
import suggestionMessages from "./modules/suggestionMessages";

if (!serviceAccountKey) {
  console.error(
    "No service account key found. Are you sure you imported seriveAccountKey.js?"
  );
  process.exit(1);
}

// ? SETUP IMPORTS ? //

dotenv.config();

// exit with error if env variables are not set
if (!process.env.BOT_TOKEN) {
  console.error(
    "No BOT_TOKEN env variable set. Are you sure you imported the .env file?"
  );
  process.exit(1);
}

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
    "DIRECT_MESSAGE_TYPING",
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as ServiceAccount),
});

// ? SETUP COMMANDS ? //

const slashCommands = new Map([
  [help.name, help],
  [user.name, user],
  [studyroom.name, studyroom],
  [stats.name, stats],
  [archive.name, archive],
  [leaderboard.name, leaderboard],
  [short.name, short],
]);

// ? DISCORD BOT FUNCTIONS ? //

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // get guild size

  const guild = client.guilds.cache.get(`762412666521124866`);

  client.user.setActivity(`Helping ${guild.memberCount} students!`, {
    type: "PLAYING",
  });

  // bulk register commands

  const commandsArray = [];

  for (const [commandName, command] of slashCommands) {
    const commandConfig = {
      name: command.name,
      description: command.description,
      options: command.options,
      default_member_permissions: command.permissions,
    };

    commandsArray.push(commandConfig);
  }

  guild.commands
    .set(commandsArray)
    .then(() => console.log("Set guild commands"))
    .catch((err) => console.error("Error setting commands: ", err));
});

// bot owner commands
client.on("messageCreate", async (message) => {
  if (!client.application?.owner) await client.application?.fetch();

  // block messages in a channel
  if (message.channel.id === "787039874384396329") return; // #verify

  if (message.content.split(" ")[0].toLowerCase() === "!xp") {
    message.reply(`It's \`!rank\` <:nathan:837570945593638924>`);
  }

  if (message.content.split(" ")[0].toLowerCase() === "!leaderboard") {
    message.reply(`It's \`!levels\` <:nathan:837570945593638924>`);
  }

  if (message.mentions.has(client.user)) {
    message.react("👋");
  }

  // if the channel is #suggestions
  if (
    message.channel.id === "839965498291519538" &&
    message.author.bot === false
  ) {
    suggestionMessages(message, client);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = slashCommands.get(interaction.commandName);

    //?? make sure slash command is not in #verify
    if (interaction.channel.id == "787039874384396329") return;

    if (command) {
      command.execute(interaction, client, app);
    }
  }

  if (interaction.isButton()) {
    const roleMenu = [
      {
        label: "Announcements",
        description: "Get mentioned for smaller server announcements!",
        value: "role_838895314814763079",
      },
      {
        label: "Tutor",
        description: "Help tutor others! You will be pinged",
        value: "role_762755031232938075",
      },
      {
        label: "Freshman",
        description: "BHS Freshmen",
        value: "role_879182310073847868",
      },
      {
        label: "Sophomore",
        description: "BHS Sophomores",
        value: "role_879182331309588540",
      },
      {
        label: "Junior",
        description: "BHS Juniors",
        value: "role_879182350397894686",
      },
      {
        label: "Senior",
        description: "BHS Seniors",
        value: "role_879182364977274900",
      },
      {
        label: "AC",
        description: "Academic Choice",
        value: "role_942965244542722048",
      },
      {
        label: "BIHS",
        description: "Berkeley International High School",
        value: "role_942965247768137778",
      },
      {
        label: "AHA",
        description: "Arts and Humanities Academy",
        value: "role_942965161315168368",
      },
      {
        label: "CAS",
        description: "Communication Arts and Sciences",
        value: "role_942965237966077973",
      },
      {
        label: "AMPS",
        description: "Academy of Medicine and Public Service",
        value: "role_942965257909981225",
      },
      {
        label: "she/her",
        description: "For those who use she/her pronouns",
        value: "role_880531092359225405",
      },
      {
        label: "he/him",
        description: "For those who use he/him pronouns",
        value: "role_880531048679743568",
      },
      {
        label: "they/them",
        description: "For those who use they/them pronouns",
        value: "role_880531201268514866",
      },
      {
        label: "Archive",
        description: "View archived channels",
        value: "role_892964728287145984",
      },
    ];

    if (interaction.customId === "add_roles") {
      const row = new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("role_add")
          .setPlaceholder("Nothing selected")
          .setMinValues(1)
          .addOptions(roleMenu)
      );
      interaction.reply({
        content: "Please select the appropriate roles!",
        ephemeral: true,
        components: [row],
      });
    }

    if (interaction.customId === "remove_roles") {
      const row = new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("role_remove")
          .setPlaceholder("Nothing selected")
          .setMinValues(1)
          .addOptions(roleMenu)
      );
      interaction.reply({
        content: "Please select the appropriate roles to remove!",
        ephemeral: true,
        components: [row],
      });
    }
  }

  if (interaction.isSelectMenu() && interaction.inCachedGuild()) {
    if (interaction.customId.startsWith("role")) {
      // remove "role_" from string
      const roleType = interaction.customId.substring(5);
      if (roleType === "add") {
        interaction.values.forEach(function (value) {
          // remove first 5 chars from string
          interaction.member.roles.add(value.slice(5));
        });
        await interaction.update({
          content: "Roles added!",
          components: [],
        });
      }

      if (roleType === "remove") {
        interaction.values.forEach(function (value) {
          // remove first 5 chars from string
          interaction.member.roles.remove(value.slice(5));
        });
        await interaction.update({
          content: "Roles removed!",
          components: [],
        });
      }
    }
  }
});

// delete empty voice channels in a category
client.on("voiceStateUpdate", async (oldState, newState) => {
  // check if oldState.channel is not null
  if (oldState.channel != null) {
    if (oldState.channel.parentId == "762757482274881536") {
      if (oldState.channel.members.size === 0) {
        await oldState.channel.delete();
      }
    }
  }
});

// log on user join
client.on("guildMemberAdd", async (member) => {
  const guild = member.guild;
  const adminChannel = (await guild.channels.fetch(
    "877376896311132210"
  )) as TextChannel;
  const user = member.user;
  const embed = {
    color: 0xeff624,
    title: "Member Joined",
    description: `<@${user.id}> has joined the server!`,
    timestamp: new Date(),
  };

  const welcomeEmbed = {
    color: 0xeff624,
    title: "How to Verify for the BHS Discord!",
    description:
      "We verify users to make sure that every student who joins the BHS Discord is a BUSD student! Don't worry, verification is a simple process, that only takes ~1 minute.\n\n**Step 1:** Visit the link below! (If you're having issues, the link is https://auth.bhs.sh)\n**Step 2:** Follow the directions, and sign in with your BUSD email, and Discord account.\n**Step 3:** That's it! You're now verified. Enjoy the BHS Discord!\n\n*If you encounter any issues with the verification process, or would like to use a different name than the one specified on your Google account, please contact <@434013914091487232>*",
  };

  const row = new Discord.MessageActionRow().addComponents(
    new Discord.MessageButton()
      .setLabel(`Click Me!`)
      .setStyle("LINK")
      .setURL(`https://auth.bhs.sh`)
  );

  member.send({
    embeds: [welcomeEmbed],
    components: [row],
  });

  await adminChannel.send({
    embeds: [embed],
  });
});

// log on user leave, and remove from emails DB
client.on("guildMemberRemove", async (member) => {
  const guild = member.guild;
  const adminChannel = (await guild.channels.fetch(
    "877376896311132210"
  )) as TextChannel;
  const user = member.user;
  const embed = {
    color: 0xeff624,
    title: "Member Left",
    description: `<@${user.id}> has left the server!`,
    timestamp: new Date(),
  };
  await adminChannel.send({
    embeds: [embed],
  });

  const db = app.firestore();

  await db.collection("users").doc(user.id).delete();
});

// message reaction add
client.on("messageReactionAdd", async (reaction, user) => {
  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);

  if (reaction.message.channel.id == "839965498291519538") {
    if (reaction.emoji.name == "🏁" || reaction.emoji.name == "🚫") {
      if (
        member.roles.highest.position >=
        guild.roles.cache.get("762719721472655430").position
      ) {
        // archive the thread
        reaction.message.thread.setArchived(true);
      }
    }
  }
});

client.on("presenceUpdate", async (oldPresence, newPresence) => {
  const guild = newPresence.guild;
  const member = newPresence.member;

  client.user.setActivity(`Helping ${guild.memberCount} students!`, {
    type: "PLAYING",
  });
});

client.login(process.env.BOT_TOKEN);

// ? WEB API & EXPRESS ? //
authServer(client, admin, app);
