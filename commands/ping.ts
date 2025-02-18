import {
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  type CommandInteraction,
} from "discord.js";

export default {
  infos: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows response time in milliseconds."),
  async run(_interaction: CommandInteraction) {
    _interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: ":ping_pong: Pong!",
          description: `Response time: ${Math.abs(
            Date.now() - _interaction.createdTimestamp
          )}ms`,
          color: Colors.Blurple,
        }),
      ],
    });

    return;
  },
};
