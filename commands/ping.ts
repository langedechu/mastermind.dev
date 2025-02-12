import { Colors, EmbedBuilder, type CommandInteraction } from "discord.js";

export default {
  name: "ping",
  description: "Replies with 'Pong!'.",
  run(_interaction: CommandInteraction) {
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
  },
};
