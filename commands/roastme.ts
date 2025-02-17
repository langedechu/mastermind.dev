import {
  BaseInteraction,
  Colors,
  EmbedBuilder,
  InteractionResponse,
  SlashCommandBuilder,
  type CommandInteraction,
} from "discord.js";
import { OpenAI } from "openai";
import mysql from "mysql";

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function getLastRoastTime(_userId: string): Promise<number> {
  return parseInt(
    await new Promise((resolve, reject) => {
      pool.query(
        "SELECT last_roast_time FROM users WHERE user_id = ?",
        [_userId],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(results[0]?.last_roast_time);
        }
      );
    })
  );
}

async function setLastRoastTime(_userId: string, _timestamp: number) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users (user_id, last_roast_time) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_roast_time = ?",
      [_userId, _timestamp, _timestamp],
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(void 0);
      }
    );
  });
}

const roastMe = async (
  _interaction: BaseInteraction,
  _message: InteractionResponse
) => {
  const userId = _interaction.user.id;
  let lastRoastTime;

  try {
    lastRoastTime = await getLastRoastTime(userId);
  } catch (_error) {
    await _message.edit({
      embeds: [
        new EmbedBuilder({
          title: "Roast Me",
          description: `An error occurred while trying to fetch the roast time. Please try again later. \`\`\`${_error}\`\`\``,
          color: Colors.Red,
          footer: {
            text: _interaction.user.username,
            icon_url: _interaction.user.displayAvatarURL(),
          },
        }),
      ],
    });

    return;
  }

  if (lastRoastTime && Date.now() - lastRoastTime < 24 * 60 * 60 * 1000) {
    await _message.edit({
      embeds: [
        new EmbedBuilder({
          title: "Roast Me",
          description:
            "You can only be roasted once a day. Please try again later.",
          color: Colors.Red,
          footer: {
            text: _interaction.user.username,
            icon_url: _interaction.user.displayAvatarURL(),
          },
        }),
      ],
    });
    return;
  }

  try {
    await setLastRoastTime(userId, Date.now());
  } catch (_error) {
    await _message.edit({
      embeds: [
        new EmbedBuilder({
          title: "Roast Me",
          description: `An error occurred while trying to save the roast time. Please try again later. \`\`\`${_error}\`\`\``,
          color: Colors.Red,
          footer: {
            text: _interaction.user.username,
            icon_url: _interaction.user.displayAvatarURL(),
          },
        }),
      ],
    });

    return;
  }

  const prompt = `Roast this user.

  Here are their public profile informations:
  - Username: ${_interaction.user.username}
  - Avatar Decoration Data ${JSON.stringify(
    _interaction.user.avatarDecorationData
  )}
  - Avatar URL: ${_interaction.user.displayAvatarURL()}
  - Is a bot: ${_interaction.user.bot}
  - Created At: ${_interaction.user.createdAt}
`;

  const completion = await ai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: prompt }],
  });

  const response = completion.choices[0].message;

  _message.edit({
    embeds: [
      new EmbedBuilder({
        title: "Roast Me",
        description: response.content ?? "No response.",
        color: Colors.Red,
        footer: {
          text: _interaction.user.username,
          icon_url: _interaction.user.displayAvatarURL(),
        },
      }),
    ],
  });
};

export default {
  infos: new SlashCommandBuilder()
    .setName("roastme")
    .setDescription("Ask ChatGPT to roast you based on your profile."),
  async run(_interaction: CommandInteraction) {
    await roastMe(
      _interaction,
      await _interaction.reply({
        embeds: [
          new EmbedBuilder({
            title: "Roast Me",
            description: "Roasting...",
            color: Colors.Red,
            footer: {
              text: _interaction.user.username,
              icon_url: _interaction.user.displayAvatarURL(),
            },
          }),
        ],
      })
    );

    return;
  },
};
