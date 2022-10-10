const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { tmdb_key, dbUser, dbPass, dbName } = require('../config.json');
const https = require('https');
const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  user: dbUser,
  password: dbPass,
  database: dbName
});

dbConnection.connect((err) => {
  if(err) throw err;
  console.log('connected to db...');
});

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
  let sql = `CREATE TABLE if not exists userlist (username VARCHAR(25) PRIMARY KEY, title VARCHAR(50), url VARCHAR(100));  
            INSERT INTO userlist (username, title, url) VALUES ('cmoorelabs', '${movie.title}', '${movie.imageURL}')`;
  dbConnection.query(sql, (error, result) =>  {
    if(error) throw error;
    console.log("1 record inserted");
    getUserMovieList();
  });

  let getUserMovieList = () => {
    let sql = `SELECT * FROM userlist`;
    dbConnection.query(sql, (error, result) => {
      if(error) throw error;
      console.log(result);
    })
  }
}; 
