const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const https = require('https');
const { dbConnection } = require('../connect.js');
const { createMovieEmbed, createMovieBookEmbed, createBlankEmbed } = require('../movie.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movielist')
    .setDescription('Show users list of movies'),
  execute(interaction) {
    getMovieList(interaction);
  }
};

const bookButtons = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('left')
      .setLabel('⬅️')
      .setStyle(ButtonStyle.Primary),
  ).addComponents(
    new ButtonBuilder()
      .setCustomId('right')
      .setLabel('➡️')
      .setStyle(ButtonStyle.Primary),
  ).addComponents(
    new ButtonBuilder()
      .setCustomId('delete')
      .setLabel('Delete')
      .setStyle(ButtonStyle.Danger),
);

let deleteMovieForUser = (movieName, userId) => {
  let sql = `DELETE
            FROM 
              users_movies
            WHERE
              users_movies.title = '${movieName}';
            `;
  dbConnection.query(sql, async (error, result) =>  {
    if(!error) {
      console.log(`success deleting`); 
    } else {
      console.error(error);
    }
  });
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
      if(!error && (result[0] !== undefined)) {
      let movieBook = createMovieBookEmbed(result); 
      
      let message = await interaction.reply({ content: `Page ${movieBook.currentPage+1}`, ephemeral: true, embeds: [movieBook.embeds[movieBook.currentPage]], components: [bookButtons] });

      const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button });
      //decide what to do with button interaction
      collector.on('collect', i => {
        if (i.user.id === interaction.user.id) {
          //left or right book pages
          if(i.customId === 'left') {
            if(movieBook.currentPage > 0){
              movieBook.currentPage -= 1;
              i.update({ content: `Page ${movieBook.currentPage+1}`, embeds: [movieBook.embeds[movieBook.currentPage]] });
            } else {
              i.update({ content: `Page ${movieBook.currentPage+1}` });
            }
          } else if (i.customId === 'right'){
            if(movieBook.currentPage < movieBook.embeds.length - 1){
              movieBook.currentPage += 1;
              i.update({ content: `Page ${movieBook.currentPage+1}`, embeds: [movieBook.embeds[movieBook.currentPage]] });
            } else {
              i.update({ content: `Page ${movieBook.currentPage+1}` });
            }
          } else if (i.customId === 'delete') {
            let movieName = movieBook.embeds[movieBook.currentPage]['data']['title'];
            deleteMovieForUser(movieName, interaction.user.id);
            movieBook.embeds.splice(movieBook.currentPage, 1);
            if(movieBook.embeds.length == 0){
              let embed = createBlankEmbed('blankbook');
              i.update({ content: `Page ${movieBook.currentPage+1}\nMovie Delete`, embeds: [embed], components: [] });
            } else {
              i.update({ content: `Page ${movieBook.currentPage+1}\nMovie Delete`, embeds: [movieBook.embeds[movieBook.currentPage]] });
            }
          }
          
        } else {
          i.reply({ content: `These buttons aren't for you`, ephemeral: true});
        } 
      });

      collector.on('end', collected => {
      });
    } else if (result[0] == undefined) {
        await interaction.reply({ content: `You have not added any movies`, ephemeral: true });
    } else {
      console.error(error);
      await interaction.reply({ content: `There was an error ${error}`, ephemeral: true });
    }
    
})};