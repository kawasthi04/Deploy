// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Load environment variables from .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
// // app.use(cors());
// app.use(cors({
//   origin: "https://axiomfe.onrender.com"  // or use '*' for testing, then restrict later
// }));
// app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://axiomfe.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    process.exit(1); // Exit with failure
  }
};

// Call the connectDB function
connectDB();

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // hashed password
});
const Admin = mongoose.model('Admin', adminSchema);

// Article Schema
const articleSchema = new mongoose.Schema({
  headline: { type: String, required: true },
  content: String, // Rich HTML content saved here.
  links: [String],
  images: [String],
  attachments: [String],
  category: { type: String, enum: ['events', 'academic', 'career', 'hostel'], required: true },
  adminName: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  timestamp: { type: Date, default: Date.now },
  tags: { type: [String], default: [] }
});
const Article = mongoose.model('Article', articleSchema);

// Middleware for authenticating Admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = {
      id: decoded.adminId,
      username: decoded.username
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Google Cloud Storage setup
const storageClient = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE_PATH,
});
const bucketName = 'axiom-bucket'; // Replace with your bucket name if needed
const upload = multer({ storage: multer.memoryStorage() });

// Routes

// Get all articles
app.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ timestamp: -1 });
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific article by ID
app.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get articles by category
app.get('/articles/category/:category', async (req, res) => {
  try {
    const articles = await Article.find({ category: req.params.category }).sort({ timestamp: -1 });
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    res.status(500).json({ error: error.message });
  }
});

// Post a new article (requires authentication)
app.post('/articles', authenticateAdmin, async (req, res) => {
  try {
    const newArticle = new Article({
      ...req.body,
      adminId: req.admin.id,
      adminName: req.admin.username
    });
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update an article (only by its admin)
app.put('/articles/:id', authenticateAdmin, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    if (article.adminId.toString() !== req.admin.id) {
      return res.status(403).json({ message: "Not authorized to edit this article" });
    }
    
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body, adminId: req.admin.id },
      { new: true }
    );
    
    res.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an article (only by its admin)
app.delete('/articles/:id', authenticateAdmin, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    if (article.adminId.toString() !== req.admin.id) {
      return res.status(403).json({ message: "Not authorized to delete this article" });
    }
    
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin registration
app.post('/admins/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashedPassword });
    const savedAdmin = await admin.save();
    res.status(201).json({ message: "Admin registered", adminId: savedAdmin._id });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin login
app.post('/admins/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ 
      message: "Login successful", 
      token, 
      adminId: admin._id, 
      username: admin.username 
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload images to GCS
app.post('/upload', authenticateAdmin, upload.array('images', 10), async (req, res) => {
  try {
    const bucket = storageClient.bucket(bucketName);
    const fileUploadPromises = req.files.map(file => {
      const blob = bucket.file(`uploads/${Date.now()}-${file.originalname}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });
      return new Promise((resolve, reject) => {
        blobStream.on('error', err => reject(err));
        blobStream.on('finish', async () => {
          try {
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          } catch (err) {
            reject(err);
          }
        });
        blobStream.end(file.buffer);
      });
    });
    const fileUrls = await Promise.all(fileUploadPromises);
    res.json(fileUrls);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload PDFs to GCS
app.post('/upload-pdfs', authenticateAdmin, upload.array('pdfs', 10), async (req, res) => {
  try {
    const bucket = storageClient.bucket(bucketName);
    const fileUploadPromises = req.files.map(file => {
      const blob = bucket.file(`uploads/pdfs/${Date.now()}-${file.originalname}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });
      return new Promise((resolve, reject) => {
        blobStream.on('error', err => reject(err));
        blobStream.on('finish', async () => {
          try {
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          } catch (err) {
            reject(err);
          }
        });
        blobStream.end(file.buffer);
      });
    });
    const pdfUrls = await Promise.all(fileUploadPromises);
    res.json(pdfUrls);
  } catch (error) {
    console.error('Error uploading PDFs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Axiom Newsletter API is running');
});

// Use the PORT value from .env (defaulting to 5000 if not set)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
