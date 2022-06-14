import mongoose from 'mongoose';

export interface JumbotronData {
  title: string;
  subTitle: string;
  image: string;
  alt: string;
  direction: string;
}

const Schema = mongoose.Schema;

const jumbotronSchema = new Schema<JumbotronData>({
  title: {
    type: String,
    required: true,
  },
  subTitle: { type: String, required: true },
  image: { type: String, required: true },
  alt: { type: String, required: true },
  direction: { type: String, required: true },
});

export default mongoose.model('jumbo', jumbotronSchema);
