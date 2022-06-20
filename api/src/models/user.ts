import mongoose from 'mongoose';

interface User {
  firstName: string;
  email: string;
  password: string;
  photoURL: string;
  watchLater: { movies: number[]; series: number[] };
}

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photoURL: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  watchLater: {
    movies: [Number],
    series: [Number],
  },
});

userSchema.methods.updateWatchList = function (slug: string, id: number) {
  let WatchListMovies = this.watchLater.movies,
    WatchListSeries = this.watchLater.series;
  if (slug === 'movies') {
    WatchListMovies = this.watchLater.movies.filter((movieId: number) => {
      return movieId !== id;
    });
    if (WatchListMovies.length === this.watchLater.movies.length) {
      WatchListMovies.push(id);
    }
  } else {
    WatchListSeries = this.watchLater.series.filter((movieId: number) => {
      return movieId !== id;
    });
    if (WatchListSeries.length === this.watchLater.series.length) {
      WatchListSeries.push(id);
    }
  }
  const updatedWatchLater = {
    movies: WatchListMovies,
    series: WatchListSeries,
  };
  this.watchLater = updatedWatchLater;
  return this.save();
};

export default mongoose.model('User', userSchema);
