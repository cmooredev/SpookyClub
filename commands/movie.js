const { SlashCommandBuilder } = require('discord.js');
const { tmdb_key } =require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movie')
    .setDescription('Replies with a trending spooky movie!'),
  async execute(interaction) {
    await interaction.reply('Movie incoming!');
  },
};
