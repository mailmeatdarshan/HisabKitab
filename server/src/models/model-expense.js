const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expanseSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Expanse = mongoose.model("Expanse", expanseSchema);

module.exports = Expanse;