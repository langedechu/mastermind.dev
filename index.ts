import {
  Client,
  Colors,
  CommandInteraction,
  Embed,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  MessageFlags,
} from "discord.js";
import fs from "fs";

type fullCommandDescriptor = {
  name: string;
  description: string;
  run: (_interaction: CommandInteraction) => void;
};

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
    .filter((_command) => _command.name == _interaction.commandName)
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

  command.run(_interaction);
});

client.login(process.env.TOKEN);
