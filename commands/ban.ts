import {
  AttachmentBuilder,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  PermissionsBitField,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
  type CommandInteraction,
  type UserResolvable,
} from "discord.js";

export default {
  infos: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("The ban hammer has spoke. It said <reason>.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("target")
        .setDescription("Target.")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("reason")
        .setDescription("What did the ban hammer said?")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild),

  async run(_interaction: CommandInteraction) {
    const mentionnedUser: UserResolvable | undefined =
      _interaction.options.get("target")?.user;
    const banReason: string = String(_interaction.options.get("reason")?.value);

    if (!mentionnedUser) {
      _interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: ":x: Mention error.",
            description: `It appears you have mentionned a non-existant user. 
            
            If this user exists and / or you think it's a but, please contact **@belle_anna.a** on Discord.`,
          }),
        ],
      });
      return;
    }

    try {
      await _interaction.guild?.bans.create(mentionnedUser, {
        reason: banReason,
      });

      _interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: "THE BAN HAMMER HAS SPOKE.",
            fields: [
              {
                name: "Banned user",
                value: String(mentionnedUser.username),
              },
              {
                name: "Reason",
                value: String(_interaction.options.get("reason", true).value),
              },
            ],
          }),
        ],
      });

      return;
    } catch (_err) {
      _interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: "Oops, the ban hammer appears to be mute.",
            fields: [
              {
                name: "Reason",
                value: String(_err),
              },
            ],
          }),
        ],
      });

      return;
    }
  },
};
