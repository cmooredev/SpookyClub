const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { tmdb_key } = require('../config.json');
const https = require('https');
const { dbConnection } = require('../connect.js');

//url hardcoded with 'orphan: first kill' recommendations
//will allow user to select a movie and then display recommendations
const url = `https://api.themoviedb.org/3/movie/760161/similar?api_key=${tmdb_key}&language=en-US&page=1`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newmovie')
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
  let movieRecommendation = {
    imageURL: `https://image.tmdb.org/t/p/original/${movieChoice.poster_path}`,
    title: movieChoice.original_title,
    description: movieChoice.overview
  }

  const movieEmbed = new EmbedBuilder()
    .setColor(0xFFA500)
    .setTitle(movieRecommendation.title)
    .setDescription(movieRecommendation.description)
    .setImage(movieRecommendation.imageURL);

  console.log(movieChoice);
  setMovieForUser(movieRecommendation);
  return movieEmbed;
};

let setMovieForUser = (movie) => {
  let sql = `CREATE TABLE if not exists users (username VARCHAR(25) NOT NULL PRIMARY KEY);
            CREATE TABLE if not exists movies (title VARCHAR(50) NOT NULL PRIMARY KEY, url VARCHAR(100));
            CREATE TABLE if not exists users_movies (username VARCHAR(25) NOT NULL, title VARCHAR(50) NOT NULL, PRIMARY KEY (username, title));   
            INSERT IGNORE INTO users (username) VALUES ('cmoorelabs');
            INSERT IGNORE INTO movies (title, url) VALUES ('${movie.title}', '${movie.imageURL}');
            INSERT IGNORE INTO users_movies (username, title) VALUES ('cmoorelabs', '${movie.title}');`;
  dbConnection.query(sql, (error, result) =>  {
    if(error) throw error;
    console.log("1 record inserted");
  });
}; 
