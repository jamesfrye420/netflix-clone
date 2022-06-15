import mongoose from 'mongoose';

interface User {
  firstName: string;
  email: string;
  password: string;
  photoURL: string;
  watchLater: { movies: string[]; series: string[] }[];
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
  },
  photoURL: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  watchLater: [
    {
      movies: String,
      series: String,
    },
  ],
});

export default mongoose.model('User', userSchema);
