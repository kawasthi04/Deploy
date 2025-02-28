// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/axiom', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

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

// Google Cloud Storage setup
const storageClient = new Storage();
const bucketName = 'axiom-bucket'; // Replace with your bucket name
const upload = multer({ storage: multer.memoryStorage() });

// Routes

// Get all articles
app.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ timestamp: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post a new article
app.post('/articles', async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an article (only by its admin)
app.put('/articles/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const adminId = decoded.adminId;
    
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    if (!article.adminId || article.adminId.toString() !== adminId) {
      return res.status(403).json({ message: "Not authorized to edit this article" });
    }
    Object.assign(article, req.body);
    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin registration
app.post('/admins/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashedPassword });
    const savedAdmin = await admin.save();
    res.status(201).json({ message: "Admin registered", adminId: savedAdmin._id });
  } catch (error) {
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
      process.env.JWT_SECRET || "secret",
      { expiresIn: '1h' }
    );
    res.json({ message: "Login successful", token, adminId: admin._id, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload images to GCS
app.post('/upload', upload.array('images', 10), async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

// Upload PDFs to GCS
app.post('/upload-pdfs', upload.array('pdfs', 10), async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Axiom Newsletter API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
