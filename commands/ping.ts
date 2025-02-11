import type { CommandInteraction } from "discord.js";

export default {
  name: "ping",
  description: "Replies with 'Pong!'.",
  run(_interaction: CommandInteraction) {
    _interaction.reply("Pong!");
  },
};
