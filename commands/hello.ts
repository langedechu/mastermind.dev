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
    .setName("hello")
    .setDescription("Greets <user> nicely.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("mention")
        .setDescription("Mention of a user.")
        .setRequired(true)
    ),

  async run(_interaction: CommandInteraction) {
    const mentionnedUser = _interaction.options.get("mention")?.user;

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

    _interaction.reply({
      embeds: [
        new EmbedBuilder({
          description: `:waving_hand: Everyone say hello to <@${
            mentionnedUser?.id
          }>

          :ping_pong: Response time: ${Math.abs(
            Date.now() - _interaction.createdTimestamp
          )}ms`,
          color: Colors.Navy,
          image: {
            url: "attachment://hello.png",
          },
        }),
      ],
      files: [new AttachmentBuilder("assets/hello.png")],
    });

    return;
  },
};
