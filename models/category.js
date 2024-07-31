import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Define the schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 1, // Use minlength instead of minLength for Mongoose validation
      maxlength: 20, // Use maxlength instead of maxLength for Mongoose validation
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to categorySchema
categorySchema.plugin(uniqueValidator);

// Register model if not already registered
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
