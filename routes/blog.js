const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Review = require('../models/Review');

// Home page
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(6);

    const reviews = await Review.find().sort({ createdAt: -1 }).limit(6);

    res.render('index', { blogs, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Blog detail page
router.get('/blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send('Blog not found');

    res.render('blog-detail', { blog });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
