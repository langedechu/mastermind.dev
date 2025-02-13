import {
  AttachmentBuilder,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandUserOption,
  type CommandInteraction,
} from "discord.js";

export default {
  infos: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Awwww what a cutiepie!"),

  async run(_interaction: CommandInteraction) {
    _interaction.reply({
      embeds: [
        new EmbedBuilder({
          description: `
          :ping_pong: Response time: ${Math.abs(
            Date.now() - _interaction.createdTimestamp
          )}ms`,
          color: Colors.Navy,
          image: {
            url: "https://cataas.com/cat",
            proxyURL: "https://cataas.com/cat",
            height: 200,
          },
          footer: {
            text: "Powered by CATAAS.com",
            iconURL: "https://cataas.com/cat?width=32&height=32",
            proxyIconURL: "https://cataas.com/cat?width=32&height=32",
          },
        }),
      ],
    });

    return;
  },
};
