import { FormattingPatterns, REST, Routes } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";

// ? Init .env file

dotenv.config();

// ? Descriptor type for commands

type commandDescriptor = {
  name: string;
  description: string;
};

// ? Handle command files

let commands: commandDescriptor[] = [];

async function loaderHandleFileNames(_fileNames: string[]) {
  return new Promise((_resolve) => {
    _fileNames.forEach((_fileName, _index) => {
      const command: commandDescriptor =
        require(`./commands/${_fileName}`).default;

      commands.push({
        name: command.name,
        description: command.description,
      });

      if (_index == _fileNames.length - 1) {
        _resolve(null);
      }
    });
  });
}

// Register command descriptors

async function registerCommands(_commands: commandDescriptor[]) {
  const rest = new REST({ version: "10" }).setToken(
    process.env.TOKEN as string
  );

  try {
    console.info("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID as string),
      { body: _commands }
    );

    console.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

// ? Load and register command files

try {
  var fileNames = await fs.promises.readdir("./commands/", "utf-8");
  await loaderHandleFileNames(fileNames);
  registerCommands(commands);
} catch (_readError) {
  throw _readError;
}
