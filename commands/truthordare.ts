import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
  User,
  type CommandInteraction,
  type Interaction,
  type MessageActionRowComponentBuilder,
} from "discord.js";

export default {
  infos: new SlashCommandBuilder()
    .setName("truthordare")
    .setDescription("Challenge a user to a truth or dare.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("user")
        .setDescription("The user to challenge.")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("truth")
        .setDescription("Ask a truth.")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("dare")
        .setDescription("Ask a dare.")
        .setRequired(true)
    ),

  async run(_interaction: CommandInteraction) {
    try {
      await _interaction.deferReply();

      const user: User = _interaction.options.get("user", true).user as User,
        truth: string = _interaction.options.get("truth", true).value as string,
        dare: string = _interaction.options.get("dare", true).value as string;

      const truthButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Truth")
        .setCustomId("truth");

      const dareButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Dare")
        .setCustomId("dare");

      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          truthButton,
          dareButton
        );

      const interactionReply = await _interaction.followUp({
        embeds: [
          new EmbedBuilder({
            title: "Truth or Dare",
            description: `@${user.username}, you have challenged ${user.username} to a game of Truth or Dare!`,
            color: Colors.Green,
            footer: {
              text: _interaction.user.username,
              icon_url: _interaction.user.displayAvatarURL(),
            },
          }),
        ],
        components: [row],
        options: {
          withResponse: true,
        },
      });

      function collectorFilter(i: Interaction) {
        return i.isButton() && i.user.id === _interaction.user.id;
      }

      const confirmation = await interactionReply.awaitMessageComponent({
        filter: collectorFilter,
      });

      if ((confirmation as ButtonInteraction).customId == "truth") {
        if ((confirmation as ButtonInteraction).user.id !== user.id) {
          await confirmation.reply({
            content: "You can't choose for someone else.",
            flags: MessageFlags.Ephemeral,
          });

          return;
        }

        await confirmation.reply({
          content: `You have chosen Truth: ${truth}`,
          components: [],
        });
      } else {
        if ((confirmation as ButtonInteraction).user.id !== user.id) {
          await confirmation.reply({
            content: "You can't choose for someone else.",
            flags: MessageFlags.Ephemeral,
          });

          return;
        }

        await confirmation.reply({
          content: `You have chosen Dare: ${dare}`,
          components: [],
        });
      }
    } catch (_error) {
      console.error(_error);
    }

    return;
  },
};
