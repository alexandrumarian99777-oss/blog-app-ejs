const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const slugify = require('slugify');

router.get('/fix-slugs', async (req, res) => {
  try {
    const blogs = await Blog.find();

    for (const b of blogs) {
      b.slug = slugify(b.title, { lower: true, strict: true });
      await b.save();
    }

    res.send("All blog slugs updated!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fixing slugs");
  }
});

// HOME PAGE
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.render('index', {
      blogs,
      reviews
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// BLOG DETAIL (slug)
router.get('/blog/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    res.render("blog-detail", { blog });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
