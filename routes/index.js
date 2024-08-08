const express = require('express');
const router = express.Router();
const { Photo } = require('./upload'); // Import the Photo model

// Index route to display all photos
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find();
    res.render('index', { photos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving photos from the database.");
  }
});

module.exports = router;
