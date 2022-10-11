const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');
const { dbConnection } = require('../connect.js');
const { createMovieListEmbed } = require('../movie.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movielist')
    .setDescription('Show users list of movies'),
  execute(interaction) {
    getMovieList(interaction);
  }
};

let getMovieList = (interaction) => {
  let sql = `SELECT 
              users.*,
              movies.*
            FROM 
              users
            INNER JOIN 
              users_movies
            ON 
              users_movies.username=users.username
            INNER JOIN
              movies
            ON
              movies.title=users_movies.title`;
    dbConnection.query(sql, async (error, result) => {
    if(error) throw error;
    const embeds = [];
    let embed;
    for (let movie of result){
      //console.log(`list ${movie.poster_path}`);
      console.log(`here we are ${movie.username}`);
      embed = createMovieListEmbed(movie);
      console.log(embed);
      embeds.push(embed);
    }
    await interaction.reply({ embeds: embeds});
})};