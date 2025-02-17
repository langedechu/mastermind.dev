import {
  Colors,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type CommandInteraction,
} from "discord.js";

export default {
  infos: new SlashCommandBuilder()
    .setName("muteroulette")
    .setDescription("Mutes a random user in the guild."),
  async run(_interaction: CommandInteraction) {
    const guild = _interaction.guild;

    if (!guild) {
      _interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: "Invalid interaction.",
            description: `:no_entry: Command is not available in DMs.`,
            color: Colors.Aqua,
            footer: {
              text: _interaction.user.username,
              icon_url: _interaction.user.displayAvatarURL(),
            },
          }),
        ],
      });

      return;
    }

    const randomMember = guild.members.cache.at(
      Math.floor(Math.random() * guild.members.cache.size)
    ) as GuildMember;

    _interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: "Mute Roulette",
          description: `:mute: ${randomMember?.user.username} has been muted for 2 hours.`,
          color: Colors.Blurple,
          footer: {
            text: _interaction.user.username,
            icon_url: _interaction.user.displayAvatarURL(),
          },
        }),
      ],
    });

    randomMember?.permissions.remove(PermissionFlagsBits.SendMessages);

    setTimeout(() => {
      randomMember?.permissions.add(PermissionFlagsBits.SendMessages);
    }, 1000 * 60 * 60 * 2);

    return;
  },
};
