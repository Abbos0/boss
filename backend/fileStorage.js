// backend/fileStorage.js
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Fayllarni yuklash uchun

// Yuklanadigan fayllar uchun papka
const uploadFolder = path.join(__dirname, 'uploads');

// Papka mavjud emas bo'lsa, uni yaratish
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // Fayllar bu papkaga saqlanadi
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Fayl nomini vaqtga asoslangan qilib beramiz
  }
});

const upload = multer({ storage: storage });

// Fayl yuklash funksiyasi
const uploadFile = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Faylni yuklashda xato!', error: err });
    }
    res.status(200).json({ message: 'Fayl muvaffaqiyatli yuklandi!', file: req.file });
  });
};

// Faylni olish
const getFile = (req, res) => {
  const filePath = path.join(uploadFolder, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'Fayl topilmadi!' });
  }
};

module.exports = { uploadFile, getFile };

