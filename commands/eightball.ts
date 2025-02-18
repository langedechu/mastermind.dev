import {
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
  type CommandInteraction,
} from "discord.js";
import crypto from "crypto";

const responses = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes – definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful.",
];

export default {
  infos: new SlashCommandBuilder()
    .setName("eightball")
    .setDescription("Ask the magic 8-ball a question.")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("question")
        .setDescription("The question you want to ask the 8-ball.")
        .setRequired(true)
    ),
  async run(_interaction: CommandInteraction) {
    const question = _interaction.options.get("question", true).value as string;
    const randomIndex = crypto.randomInt(0, responses.length);

    _interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: "Magic 8-Ball",
          description: `:8ball: **Question:** ${question}
          
          :crystal_ball: **Answer:** ${responses[randomIndex]}`,
          color: Colors.Blurple,
          footer: {
            text: _interaction.user.username,
            icon_url: _interaction.user.displayAvatarURL(),
          },
        }),
      ],
    });

    return;
  },
};
