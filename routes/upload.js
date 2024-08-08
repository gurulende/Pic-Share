const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Define Photo schema and model
const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true }, // Store base64 string
});
const Photo = mongoose.model('Photo', photoSchema, 'photos');

// Configure Multer for file uploads (using memory storage for base64 conversion)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Validation middleware
const validationFormWithImage = [
  body('title').isLength({ min: 5 }).withMessage('Title is required with at least 5 characters'),
  body('description').isLength({ min: 10 }).withMessage('Description is required with at least 10 characters'),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).render('upload', { errors: [{ msg: 'Image is required' }] });
    }
    next();
  }
];

// Display upload form
router.get('/', (req, res) => {
  res.render('upload', { errors: null });
});

// Handle photo upload
router.post('/', upload.single('photo'), validationFormWithImage, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('upload', { errors: errors.array() });
  }

  const { title, description } = req.body;
  const imagePath = req.file.buffer.toString('base64'); // Convert image to base64

  try {
    const photo = new Photo({ title, description, imagePath });
    await photo.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading photo');
  }
});

module.exports = {
  router, // Export the router
  Photo  // Export the Photo model
};
