import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  imdbID: { type: String, required: true, unique: true },
  Title: String,
  Year: String,
  Poster: String,
  Type: String,
  Plot: String,
  Runtime: String,
  Genre: String,
  Director: String,
  cachedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Movie', movieSchema);