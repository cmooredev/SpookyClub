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
              movies.title=users_movies.title
            WHERE
              users.username = ${interaction.user.id}
            AND
              users_movies.username = ${interaction.user.id}
              `;
    dbConnection.query(sql, async (error, result) => {
      if(!error) {
        const embeds = [];
        let embed;
        for (let movie of result){
          embed = createMovieEmbed(movie);
          console.log(embed);
          embeds.push(embed);
      }
      await interaction.reply({ embeds: embeds});
    } else {
      console.error(error);
      await interaction.reply(`Sorry there was an error ${error}`);
    }
    
})};