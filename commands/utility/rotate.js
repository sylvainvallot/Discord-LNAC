const { SlashCommandBuilder } = require("discord.js");
const Jimp = require("jimp");

async function rotateImg(url, degrees) {
  const image = await Jimp.read(url);
  image.rotate(degrees);
  return await image.getBufferAsync(Jimp.MIME_PNG);
}

module.exports = {
  uuid: "101083E1323C4DB3BFF8F5B391F73BD7",
  permissions: "USER",
  data: new SlashCommandBuilder()
    .setName("rotate")
    .setDescription("Pivoter une image")
    .addNumberOption((option) =>
      option
        .setName("degres")
        .setDescription("De combien de degrés ?")
        .addChoices(
          {
            name: "90",
            value: 90,
          },
          {
            name: "180",
            value: 180,
          },
          {
            name: "270",
            value: 270,
          },
          {
            name: "-90",
            value: -90,
          },
          {
            name: "-180",
            value: -180,
          },
          {
            name: "-270",
            value: -270,
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("lien-message")
        .setDescription("Lien du message contenant l'image à pivoter")
    )
    .setDMPermission(false),

  async execute(interaction) {
    let imageMessage;
    if (interaction.options.getString("lien-message")) {
      const messageUrl = interaction.options.getString("lien-message");
      const urlParts = messageUrl
        .split("/")
        .filter((part) => part.trim() !== "");
      const channelID = urlParts[urlParts.length - 2];
      const messageID = urlParts[urlParts.length - 1];
      imageMessage = await interaction.channel.messages.fetch(messageID);
    } else {
      const lastMessages = await interaction.channel.messages.fetch({
        limit: 10,
      });
      imageMessage = lastMessages
        .filter((msg) => msg.attachments.size > 0)
        .first();
    }

    const image = imageMessage.attachments.first().contentType.includes("image")
      ? imageMessage.attachments.first().url
      : null;

    const degrees = interaction.options.getNumber("degres");

    if (!image) {
      return await interaction.reply({
        content: "Pas d'image trouvée",
        ephemeral: true,
      });
    }

    let rotation;
    if (!degrees) {
      rotation = 90;
    } else {
      rotation = degrees;
    }

    const rotatedImage = await rotateImg(image, rotation);
    return await interaction.reply({ files: [rotatedImage] });
  },
};
