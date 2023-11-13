require("dotenv").config();
const axios = require("axios");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  uuid: "C1E934CCC4B74C0588CAB04B4F394DEA",
  permissions: "USER",
  data: new SlashCommandBuilder()
    .setName("sport")
    .setDescription("Commandes pour ")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("classement")
        .setDescription("Affiche le classement")
        .addStringOption((option) =>
          option
            .setName("competition")
            .setDescription("Quelle compétition ?")
            .addChoices({ name: "Ligue 1", value: "l1" })
            .setRequired(true)
        )
    )
    .setDMPermission(false),

  async execute(interaction) {
    if (interaction.options.getSubcommand() == "classement") {
      const competition = interaction.options.getString("competition");

      const response = await axios
        .get("https://api.football-data.org/v4/competitions/FL1/standings", {
          headers: {
            "X-Auth-Token": process.env.FOOTBALL_API_KEY,
          },
        })
        .catch(console.error);

      const message = {
        l1: `Classement de la Ligue 1 - Journée ${response.data.season.currentMatchday}`,
      };
      const embed = new EmbedBuilder()
        .setTitle(message[competition])
        .setColor("#cdfb0a");
      const standings = response.data.standings[0].table;
      const teams = [];
      standings.forEach((team, index) => {
        const paddedTeamName = `${index + 1}. **${team.team.name}** - `;
        const pointsText = `Points: ${team.points}`;
        const teamInfo = `${paddedTeamName}${pointsText}\n( ${team.won}G |  ${team.draw}N | ${team.lost}P )`;
        // teams.push(teamInfo);
        embed.addFields({
          name: `${index + 1}. ${team.team.name} -  ${team.points} pts`,
          value: `${team.playedGames} J  |  ${team.won} G  |   ${team.draw} N  |  ${team.lost} P  |  ${team.goalsFor} BP  |  ${team.goalsAgainst} BC  |  ${team.goalDifference} Diff`,
        });
      });

      // embed.setDescription(teams.join("\n"));
      embed.setThumbnail(
        "https://www.ligue1.fr/-/media/Project/LFP/shared/Images/Competition/Favicon/L1-favicon.png"
      );
      embed.setURL("https://www.ligue1.fr/classement");
      return await interaction.reply({ embeds: [embed] });
    }
  },
};
