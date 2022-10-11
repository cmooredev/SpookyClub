const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');
const { dbConnection } = require('../connect.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movielist')
    .setDescription('Show users list of movies'),
  execute(interaction) {
    getMovieList(interaction);
  }
};

let getMovieList = (interaction) => {
  let sql = `SELECT * FROM users_movies`;
    dbConnection.query(sql, async (error, result) => {
    if(error) throw error;
    const embed = new EmbedBuilder();
    for (let movie in result){
      embed.addFields({ name: `${result[movie].title}`, value: `${result[movie].title}` });
      console.log(result[movie]);
    }
    await interaction.reply({ embeds: [embed]});
})};