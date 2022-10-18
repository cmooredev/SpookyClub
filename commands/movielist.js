const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const https = require('https');
const { dbConnection } = require('../connect.js');
const { createMovieEmbed, createMovieBookEmbed } = require('../movie.js');

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
);



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
      let movieBook = createMovieBookEmbed(result); 
      
      let message = await interaction.reply({ content: `Page ${movieBook.currentPage+1}`, ephemeral: true, embeds: [movieBook.embeds[movieBook.currentPage]], components: [bookButtons] });

      const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button });
      console.log(`moviepage ${movieBook.currentPage}`);
      //decide what to do with button interaction
      collector.on('collect', i => {
        if (i.user.id === interaction.user.id) {
          //left or right book pages
          if(i.customId === 'left') {
            console.log(`moviepage ${movieBook.currentPage}`);
            if(movieBook.currentPage > 0){
              movieBook.currentPage -= 1;
              console.log(`moviepage decreased ${movieBook.currentPage}`);
              i.update({ content: `Page ${movieBook.currentPage+1}`, embeds: [movieBook.embeds[movieBook.currentPage]] });
            } else {
              i.update({ content: `Page ${movieBook.currentPage+1}` });
              console.log('left click');
            }
          } else if (i.customId === 'right'){
            console.log(movieBook.embeds.length);
            if(movieBook.currentPage < movieBook.embeds.length - 1){
              console.log('right click');
              movieBook.currentPage += 1;
              i.update({ content: `Page ${movieBook.currentPage+1}`, embeds: [movieBook.embeds[movieBook.currentPage]] });
            } else {
              console.log('right click');
              i.update({ content: `Page ${movieBook.currentPage+1}` });
            }
          }
          
        } else {
          i.reply({ content: `These buttons aren't for you`, ephemeral: true});
        }
      });

      collector.on('end', collected => {
      });
    } else {
      console.error(error);
      await interaction.reply({ content: `You have not added any movies`, ephemeral: true });
    }
    
})};