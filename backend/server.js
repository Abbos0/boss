const express = require('express');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');  // CORS paketini import qilish
const fs = require('fs');

dotenv.config();

const app = express();
const port = 5057;

// CORS ni yoqish
app.use(cors());

// Faylni saqlash uchun multerni sozlash
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Faylni saqlash joyi
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Fayl nomini o'zgartirish
  },
});

const upload = multer({ storage: storage });

// Express body parser'ni ishlatish
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fayl yuklash API
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Fayl tanlanmagan!');
  }
  res.status(200).send('Fayl muvaffaqiyatli yuklandi!');
});

// Fayllarni olish API
app.get('/api/files', (req, res) => {
  const uploadPath = path.join(__dirname, 'uploads');
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).send('Fayllar o\'qishda xatolik.');
    }
    res.status(200).json(files);  // Fayllarning ro'yxatini qaytarish
  });
});

// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`Server ${port}-portda ishlamoqda...`);
});



