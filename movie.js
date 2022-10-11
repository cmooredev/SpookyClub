const { EmbedBuilder } = require('discord.js');

let createMovie = (movieChoice) => {
    let movie = {
      imageURL: `https://image.tmdb.org/t/p/original/${movieChoice.poster_path}`,
      title: movieChoice.original_title,
      description: movieChoice.overview,
      release_date: movieChoice.release_date
    };
    return movie;
  };
  
let createMovieEmbed = (movie) => {
  console.log(movie);
  const movieEmbed = new EmbedBuilder()
    .setColor(0xFFA500)
    .setTitle(movie.title)
    .setDescription(movie.description)
    .setImage(movie.imageURL);
  return movieEmbed;
};

  module.exports = { createMovie, createMovieEmbed };