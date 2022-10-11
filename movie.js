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

let createMovieListEmbed = (movie) => {
  const movieEmbed = new EmbedBuilder()
    .setColor(0xFFA500)
    .setTitle(movie.title)
  return movieEmbed;
};

  module.exports = { createMovie, createMovieEmbed, createMovieListEmbed };