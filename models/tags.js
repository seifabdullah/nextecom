const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 32,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

tagSchema.plugin(uniqueValidator);

module.exports = mongoose.models.Tag || mongoose.model("Tag", tagSchema);
