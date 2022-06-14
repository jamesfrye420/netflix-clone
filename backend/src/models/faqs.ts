import mongoose from 'mongoose';

export interface FaqsData {
  header: string;
  body: string;
}

const Schema = mongoose.Schema;

const faqsSchema = new Schema<FaqsData>({
  header: {
    type: String,
    required: true,
  },
  body: { type: String, required: true },
});

export default mongoose.model('faq', faqsSchema);
