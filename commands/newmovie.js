const { SlashCommandBuilder } = require('discord.js');
const { tmdb_key } = require('../config.json');
const https = require('https');
const { dbConnection } = require('../connect.js');
const { createMovie, createMovieEmbed } = require('../movie.js');

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
        let movieChoice = parsedMovie.results[Math.floor(Math.random() * 20)]
        
        let movie = createMovie(movieChoice);
        
        setMovieForUser(movie);
        let embed = createMovieEmbed(movie);
        console.log(embed);
        await interaction.reply({ embeds: [embed] });
      })
    }).on('error', (err) => {
      console.log("Error: " + error.message);
    });
  },
};

let setMovieForUser = (movie) => {
  let movieName = movie.title.replace(/'/g, "''");
  let movieDescription = movie.description.replace(/'/g, "''");
  let sql = `CREATE TABLE if not exists users (username VARCHAR(25) NOT NULL PRIMARY KEY);
            CREATE TABLE if not exists movies (title VARCHAR(50) NOT NULL PRIMARY KEY, url VARCHAR(100), release_date DATE, description VARCHAR(1000));
            CREATE TABLE if not exists users_movies (username VARCHAR(25) NOT NULL, title VARCHAR(50) NOT NULL, PRIMARY KEY (username, title));
            INSERT IGNORE INTO users (username) VALUES ('cmoorelabs');
            INSERT IGNORE INTO movies (title, url, release_date, description) VALUES ('${movieName}', '${movie.imageURL}', '${movie.release_date}', '${movieDescription}');
            INSERT IGNORE INTO users_movies (username, title) VALUES ('cmoorelabs', '${movieName}');`;
  dbConnection.query(sql, (error, result) =>  {
    if(error) throw error;
    console.log("1 record inserted");
  });
}; 
