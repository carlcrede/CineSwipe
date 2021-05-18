// function may be needed for shuffling arrays in case we end 
// up with a list of movies and a list of tv that need to be combined.
// This is built on the 'Fisher-Yates' algorithm.
const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }