const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { tmdb_key } = require('../config.json');
const https = require('https');
const mysql = require('mysql');

//url hardcoded with 'orphan: first kill' recommendations
//will allow user to select a movie and then display recommendations
const url = `https://api.themoviedb.org/3/movie/760161/similar?api_key=${tmdb_key}&language=en-US&page=1`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movie')
    .setDescription('Replies with a trending spooky movie!'),
  execute(interaction) {
    https.get(url, response => {
      let data = '';

      response.on('data', chunk => {
        data += chunk;
      });

      response.on('end', async () => {
        parsedMovie = JSON.parse(data);
        let embed = createMovieEmbed(parsedMovie);
        await interaction.reply({ embeds: [embed] });
      })
    }).on('error', (err) => {
      console.log("Error: " + error.message);
    });

  },
};

let createMovieEmbed = (parsedMovie) => {
  let movieChoice = parsedMovie.results[Math.floor(Math.random() * 20)];
  let imageURL = `https://image.tmdb.org/t/p/original/${movieChoice.poster_path}`;
  let movieTitle = movieChoice.original_title;
  let movieDescription = movieChoice.overview;

  const movieEmbed = new EmbedBuilder()
    .setColor(0xFFA500)
    .setTitle(movieTitle)
    .setDescription(movieDescription)
    .setImage(imageURL);

  console.log(movieChoice);
  return movieEmbed;
}
