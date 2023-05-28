import mongoose from "mongoose";
var Schema = mongoose.Schema;

var bookShelf = new Schema({
  idBook: {
    type: Array,
    required: true,
    unique: true,
  },
  books: {
    type: Array,
    required: true,
  },
});

//Export the model
export default mongoose.model("BookShelf", bookShelf);
