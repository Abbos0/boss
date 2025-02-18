import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5057";

function App() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [isSmsSent, setIsSmsSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Fayllar ro'yxati

  const correctPassword = '123456';

  // Parolni tekshirish
  const handleSubmitPassword = (event) => {
    event.preventDefault();
    if (password === correctPassword) {
      setFailedAttempts(0);
      setMessage('Kirish muvaffaqiyatli!');
      setIsLoggedIn(true);
    } else {
      setFailedAttempts(failedAttempts + 1);
      if (failedAttempts + 1 >= 5) {
        setIsSmsSent(true);
        setMessage('5 martadan xato kiritildi. SMS kod yuborildi.');
      } else {
        setMessage('Parol noto‘g‘ri!');
      }
    }
  };





  const handleSubmitSms = (event) => {
    event.preventDefault();
    const correctSmsCode = Math.floor(1000 + Math.random() * 9000); // SMS kodi
    if (parseInt(smsCode) === correctSmsCode) {
      setFailedAttempts(0);
      setSmsCode('');
      setMessage('SMS kod to‘g‘ri! Sayt ochildi.');
      setIsLoggedIn(true);
    } else {
      setMessage('SMS kod noto‘g‘ri!');
    }
  };

  // Faylni yuklash
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Fayl tanlanmagan!');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5057/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setMessage('Fayl muvaffaqiyatli yuklandi!');
        fetchUploadedFiles(); // Fayllar ro'yxatini yangilash
      } else {
        setMessage('Faylni yuklashda xato!');
      }
    } catch (error) {
      setMessage('Xatolik yuz berdi!');
    }
  };

  // Fayllarni serverdan olish
  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5057/api/files');
      setUploadedFiles(response.data); // Fayllar ro'yxatini saqlash
    } catch (error) {
      setMessage('Fayllarni olishda xato!');
    }
  };

  // React component o'zgarishlarini kuzatish
  useEffect(() => {
    if (isLoggedIn) {
      fetchUploadedFiles(); // Fayllarni yangilash
    }
  }, [isLoggedIn]);

 
  useEffect(() => {
    // Backenddan fayllarni olish
    fetch(`${API_URL}/api/files`)
      .then(response => response.json())
      .then(data => setFiles(data))
      .catch(error => console.log("Error:", error));
  }, []);

  return (
    <div className="App">
      <h1>Parolni kiriting:</h1>

      {!isSmsSent ? (
        <form onSubmit={handleSubmitPassword}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parolni kiriting"
          />
          <button type="submit">Yuborish</button>
        </form>
      ) : (
        <form onSubmit={handleSubmitSms}>
          <input
            type="text"
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            placeholder="SMS kodini kiriting"
          />
          <button type="submit">Tasdiqlash</button>
        </form>
      )}

      <p>{message}</p>


      <div>
      <h1>Uploaded Files</h1>
      <ul>
  {uploadedFiles.map((file, index) => (
    <li key={index}>{file}</li> // ✅ `index` yoki unik ID qo‘shing
  ))}
</ul>

    </div>

      {/* Fayl yuklash formasi faqat login bo'lgan foydalanuvchilarga ko'rsatiladi */}
      {isLoggedIn && (
        <div>
          <h2>Faylni yuklang:</h2>
          <form onSubmit={handleFileUpload}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Yuklash</button>
          </form>

          <h2>Yuklangan Fayllar:</h2>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;



