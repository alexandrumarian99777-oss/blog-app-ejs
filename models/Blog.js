const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now }
});

// Auto-create slug before saving
BlogSchema.pre('save', function (next) {
  if (!this.isModified('title')) return next();

  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });

  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
