const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');
const { dbConnection } = require('../connect.js');
const { createMovieEmbed } = require('../movie.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movielist')
    .setDescription('Show users list of movies'),
  execute(interaction) {
    getMovieList(interaction);
  }
};

let getMovieList = (interaction) => {
  let sql = `SELECT * FROM movies`;
    dbConnection.query(sql, async (error, result) => {
    if(error) throw error;
    const embeds = [];
    let embed;
    for (let movie of result){
      console.log(`list ${movie.poster_path}`);
      embed = createMovieEmbed(movie);
      console.log(embed);
      embeds.push(embed);
    }
    await interaction.reply({ embeds: embeds});
})};