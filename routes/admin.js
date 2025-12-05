const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const { isAuthenticated } = require('../middleware/auth');

// Admin login page
router.get('/login', (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: null });
});

// Admin login POST
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', { error: 'Invalid credentials' });
});

// Admin dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    const reviews = await Review.find().sort({ createdAt: -1 });
    
    res.render('admin/dashboard', { blogs, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create blog page
router.get('/create-blog', isAuthenticated, (req, res) => {
  res.render('admin/create-blog', { blog: null, error: null });
});

// Create blog POST (ONLY ONE)
router.post('/create-blog', isAuthenticated, async (req, res) => {
  try {
    const { title, content, excerpt, author, imageUrl, category, tags } = req.body;

    const blog = new Blog({
      title,
      content,
      excerpt,
      author: author || 'Admin',
      imageUrl: imageUrl || 'https://via.placeholder.com/800x400',
      category: category || 'General',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      published: true          // final fix
    });

    await blog.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.render('admin/create-blog', { blog: null, error: 'Failed to create blog' });
  }
});

// Edit blog page
router.get('/edit-blog/:id', isAuthenticated, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render('admin/create-blog', { blog, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update blog POST
router.post('/edit-blog/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, content, excerpt, author, imageUrl, category, tags } = req.body;
    
    await Blog.findByIdAndUpdate(req.params.id, {
      title,
      content,
      excerpt,
      author,
      imageUrl,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete blog
router.post('/delete-blog/:id', isAuthenticated, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create review POST
router.post('/create-review', isAuthenticated, async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    
    const review = new Review({
      name,
      rating: parseInt(rating),
      comment,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    });
    
    await review.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete review
router.post('/delete-review/:id', isAuthenticated, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
