const { EmbedBuilder } = require('discord.js');

let createMovie = (movieChoice) => {
    let movie = {
      poster_path: movieChoice.poster_path,
      title: movieChoice.original_title,
      description: movieChoice.overview,
      release_date: movieChoice.release_date
    };
    return movie;
  };
  
let createMovieEmbed = (movie) => {
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
  } else if (status === 'blankbook') {
    const movieEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`Add a new movie!`)
      .setDescription('Your list is blank.');
    return movieEmbed;
  }
};


let createMovieBookEmbed = (movieList) => {
  const embeds = [];
  let movieEmbed;
  let movieBook = {
    embeds,
    currentPage: 0,
  }
  for (let movie of movieList){
    movieEmbed = createMovieEmbed(movie);
    embeds.push(movieEmbed);
  }
  return movieBook;
};



  module.exports = { createMovie, createMovieEmbed, createBlankEmbed, createMovieBookEmbed };