import { Client, Message, TextChannel } from "discord.js";

const suggestionMessages = async (message: Message, client: Client) => {
  let suggestion = message.content;

  const member = await message.guild.members.fetch(message.author.id);

  const embed = {
    color: 0xeff624,
    thumbnail: {
      url: message.author.avatarURL(),
    },
    title: member.nickname,
    description: suggestion,
    timestamp: new Date(),
  };

  const channel = (await message.guild.channels.fetch(
    "839965498291519538"
  )) as TextChannel;

  const suggestionMsg = await channel.send({
    embeds: [embed],
  });

  suggestionMsg.react(message.guild.emojis.cache.get("879376341613568040"));
  suggestionMsg.react(message.guild.emojis.cache.get("879376341630341150"));

  // start thread from message

  suggestionMsg.startThread({
    name: suggestion.substring(0, 99),
    autoArchiveDuration: 4320,
    reason: suggestion,
  });

  const replyEmbed = {
    color: 0xeff624,
    title: "Suggestion Submitted!",
    description: `Your suggestion has been submitted! You can view it in <#839965498291519538>`,
    timestamp: new Date(),
  };

  message.author.send({
    embeds: [replyEmbed],
  });

  // delete message
  message.delete();
};

export default suggestionMessages;
