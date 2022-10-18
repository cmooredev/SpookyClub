const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { tmdb_key } = require('../config.json');
const https = require('https');
const { dbConnection } = require('../connect.js');
const { createMovie, createMovieEmbed, createBlankEmbed } = require('../movie.js');

const buttonRow = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('addmovie')
      .setLabel('Add')
      .setStyle(ButtonStyle.Primary),
  ).addComponents(
    new ButtonBuilder()
      .setCustomId('rejectmovie')
      .setLabel('Reject')
      .setStyle(ButtonStyle.Primary),
);
          

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
        let embed = createMovieEmbed(movie);

        let message = await interaction.reply({ ephemeral: true, embeds: [embed], components: [buttonRow] });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        //decide what to do with button interaction
        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            //if user clicks on the 'add' button, the movie is added to their list
            if(i.customId === 'addmovie') {
              setMovieForUser(movie, i);
              let embed = createBlankEmbed('add');
              i.update({ content: `Movie added`, embeds: [embed], components: [], ephemeral: true});
            } else if (i.customId === 'rejectmovie'){
              let embed = createBlankEmbed('reject');
              i.update({ content: `Movie rejected`, embeds: [embed], components: [], ephemeral: true});
            }
            
          } else {
            i.reply({ content: `These buttons aren't for you`, ephemeral: true});
          }
        });

        collector.on('end', collected => {
          console.log(`Collected ${collected.size} interactions.`);
        });

      })
    }).on('error', (err) => {
      console.log("Error: " + error.message);
    });
  },
};

let setMovieForUser = (movie, interaction) => {
  let movieName = movie.title.replace(/'/g, "''");
  let movieDescription = movie.description.replace(/'/g, "''");
  let sql = `CREATE TABLE if not exists users (username VARCHAR(25) NOT NULL PRIMARY KEY);
            CREATE TABLE if not exists movies (title VARCHAR(50) NOT NULL PRIMARY KEY, poster_path VARCHAR(100), release_date DATE, description VARCHAR(1000));
            CREATE TABLE if not exists users_movies (username VARCHAR(25) NOT NULL, title VARCHAR(50) NOT NULL, PRIMARY KEY (username, title));
            INSERT IGNORE INTO users (username) VALUES ('${interaction.user.id}');
            INSERT IGNORE INTO movies (title, poster_path, release_date, description) VALUES ('${movieName}', '${movie.poster_path}', '${movie.release_date}', '${movieDescription}');
            INSERT IGNORE INTO users_movies (username, title) VALUES ('${interaction.user.id}', '${movieName}');`;
  dbConnection.query(sql, async (error, result) =>  {
    if(!error) {
      console.log("1 record inserted");
    } else {
      console.error(error);
      await interaction.reply(`Sorry there was an error ${error}`);
    }
  });
}; 
