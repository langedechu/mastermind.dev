import {
  Client,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
} from "discord.js";
import fs from "fs";

interface fullCommandDescriptor {
  infos: SlashCommandBuilder;
  run: (_interaction: CommandInteraction) => Promise<void>;
}

const commands: fullCommandDescriptor[] = [];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}! Initializing commands...`);

  try {
    const fileNames = await fs.promises.readdir("./commands/");
    fileNames.forEach((_fileName) => {
      commands.push(
        require(`./commands/${_fileName}`).default as fullCommandDescriptor
      );
    });
  } catch (_readError) {
    throw _readError;
  }
});

client.on(Events.InteractionCreate, async (_interaction) => {
  if (!_interaction.isChatInputCommand()) return;

  const command = commands
    .filter((_command) => _command.infos.name == _interaction.commandName)
    .at(0);

  if (!command) {
    _interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: "Invalid interaction.",
          description: `:no_entry: Command is registered _but_ not implemented yet. 
        
        :mailbox_with_mail: Contact **@belle_anna.a** for further explanations.`,
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

  await command.run(_interaction);
});

client.login(process.env.TOKEN);
