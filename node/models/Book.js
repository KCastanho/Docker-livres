
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, min: 1 },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    page: { type: Number, required: true, min: 1 },
  },
  {
    id: false,
    versionKey: false,
    toJSON: {
      transform: (_document, result) => {
        delete result._id;
        return result;
      },
    },
  }
);

module.exports = mongoose.model('Book', bookSchema);
