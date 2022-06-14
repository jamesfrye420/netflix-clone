import mongoose from 'mongoose';

export interface genresData {
  id: number;
  name: string;
}

const Schema = mongoose.Schema;

const grenresSchema = new Schema<genresData>({
  id: {
    type: Number,
    required: true,
  },
  name: { type: String, required: true },
});

export default mongoose.model('seriesGenre', grenresSchema);
