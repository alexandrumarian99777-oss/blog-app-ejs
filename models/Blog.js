const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true, maxlength: 200 },
  author: { type: String, default: 'Admin' },
  imageUrl: { type: String, default: 'https://via.placeholder.com/800x400' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate slug
blogSchema.pre('save', function (next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
