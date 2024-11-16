const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Enable CORS to allow requests from the Vue.js frontend
app.use(cors());

// Create the uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// Handle the file upload POST request
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Send back the URL of the uploaded image
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});
// Endpoint to get all images in the uploads directory
app.get('/images', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).send('Unable to scan directory.');
      }
      // Filter out any non-image files (optional)
      const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file))
                          .map(file => `http://localhost:5000/uploads/${file}`);
      res.json(images);
    });
  });
  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
