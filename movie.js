const { EmbedBuilder } = require('discord.js');

let createMovie = (movieChoice) => {
    let movie = {
      poster_path: movieChoice.poster_path,
      title: movieChoice.original_title,
      description: movieChoice.overview,
      release_date: movieChoice.release_date
    };
    console.log(`inside movie = ${movie.poster_path}`);
    return movie;
  };
  
let createMovieEmbed = (movie) => {
  console.log(`test ${movie.imageURL}`);
  const movieEmbed = new EmbedBuilder()
    .setColor(0xFFA500)
    .setImage(`https://image.tmdb.org/t/p/original${movie.poster_path}`)
    .setTitle(movie.title)
    .setDescription(movie.description);
  return movieEmbed;
};

let createBlankEmbed = (status) => {
  if (status === 'add') {
    const movieEmbed = new EmbedBuilder()
      .setColor(0x00BF03)
      .setTitle(`Movie`)
      .setDescription('✅ Added to your list.');
    return movieEmbed;
  } else if (status === 'reject') {
    const movieEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle(`Movie`)
      .setDescription('❌ Movie rejected.');
    return movieEmbed;
  }
};

let createMovieBookEmbed = (movieList) => {
  const movieEmbed = new EmbedBuilder()
      .setColor(0x00BF03)
      .setTitle(`Movie`)
      .setDescription('✅ Added to your list.');
    return movieEmbed;
};

  module.exports = { createMovie, createMovieEmbed, createBlankEmbed, createMovieBookEmbed };