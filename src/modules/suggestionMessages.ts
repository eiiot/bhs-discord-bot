import { Client, EmbedBuilder, Message, TextChannel } from "discord.js";

const suggestionMessages = async (message: Message, client: Client) => {
  let suggestion = message.content;

  const member = await message.guild.members.fetch(message.author.id);

  // const embed = {
  //   color: 0xeff624,
  //   thumbnail: {
  //     url: message.author.avatarURL(),
  //   },
  //   title: member.nickname,
  //   description: suggestion,
  //   timestamp: new Date(),
  // };

  const embed = new EmbedBuilder()
    .setColor(0xeff624)
    .setThumbnail(message.author.avatarURL())
    .setTitle(member.nickname)
    .setDescription(suggestion)
    .setTimestamp(new Date());

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

  const replyEmbed = new EmbedBuilder()
    .setColor(0xeff624)
    .setTitle("Suggestion Submitted!")
    .setDescription(
      `Your suggestion has been submitted! You can view it in <#839965498291519538>`
    )
    .setTimestamp(new Date());

  message.author.send({
    embeds: [replyEmbed],
  });

  // delete message
  message.delete();
};

export default suggestionMessages;
