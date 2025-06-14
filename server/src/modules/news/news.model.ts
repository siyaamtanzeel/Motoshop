import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  description: string;
  content: string;
  image: string;
  publishDate: Date;
  author: mongoose.Types.ObjectId;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    publishDate: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model<INews>('News', newsSchema);
