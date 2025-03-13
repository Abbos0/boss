const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5057;


app.use(cors({ origin: "*" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Eng katta raqamni topish
const getNextFileNumber = () => {
  const files = fs.readdirSync(uploadDir);
  const numbers = files
    .map(file => parseInt(file.match(/^(\d+)_/)?.[1]))
    .filter(num => !isNaN(num));

  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
};

// Fayl nomini belgilash
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const nextNumber = getNextFileNumber();
    const ext = path.extname(file.originalname);
    cb(null, `${nextNumber}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Fayl tanlanmagan!" });
  }
  res.status(200).json({ message: "✅ Fayllar yuklandi!" });
});

app.get("/api/files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: "Fayllarni o‘qishda xatolik." });
    res.status(200).json(files);
  });
});

app.delete("/api/files/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ message: "Faylni o‘chirishda xatolik!" });
    res.status(200).json({ message: "✅ Fayl o‘chirildi!" });
  });
});

app.listen(port, () => console.log(`🚀 Server ${port}-portda ishlamoqda...`));









// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');
// const cors = require('cors');  // CORS paketini import qilish
// const fs = require('fs');

// dotenv.config();

// const app = express();
// const port = 5057;

// // CORS ni yoqish
// app.use(cors());

// // Faylni saqlash uchun multerni sozlash
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Faylni saqlash joyi
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Fayl nomini o'zgartirish
//   },
// });

// const upload = multer({ storage: storage });

// // Express body parser'ni ishlatish
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Fayl yuklash API
// app.post('/api/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('Fayl tanlanmagan!');
//   }
//   res.status(200).send('Fayl muvaffaqiyatli yuklandi!');
// });

// // Fayllarni olish API
// app.get('/api/files', (req, res) => {
//   const uploadPath = path.join(__dirname, 'uploads');
//   fs.readdir(uploadPath, (err, files) => {
//     if (err) {
//       return res.status(500).send('Fayllar o\'qishda xatolik.');
//     }
//     res.status(200).json(files);  // Fayllarning ro'yxatini qaytarish
//   });
// });

// // Serverni ishga tushirish
// app.listen(port, () => {
//   console.log(`Server ${port}-portda ishlamoqda...`);
// });



