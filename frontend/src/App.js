
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5057"; // Backend manzili

function App() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Fayl inputni tozalash uchun

  useEffect(() => {
    if (showFiles) {
      fetchUploadedFiles();
    }
  }, [showFiles]);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (files.length === 0) {
      alert("❌ Fayl tanlanmagan!");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post(`${API_URL}/api/upload`, formData);
      alert("✅ Fayllar yuklandi!");
      setFiles([]);
      setFileInputKey(Date.now()); // Inputni tozalash
      fetchUploadedFiles();
    } catch (error) {
      alert("❌ Xatolik yuz berdi!");
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/files`);
      const sortedFiles = response.data.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0]) || 0;
        const numB = parseInt(b.match(/\d+/)?.[0]) || 0;
        return numA - numB;
      });
      setUploadedFiles(sortedFiles);
    } catch (error) {
      alert("❌ Fayllarni olishda xatolik!");
    }
  };

  const handleDeleteFile = async (filename) => {
    try {
      await axios.delete(`${API_URL}/api/files/${filename}`);
      alert("🗑️ Fayl o‘chirildi!");
      fetchUploadedFiles();
    } catch (error) {
      alert("❌ Faylni o‘chirishda xatolik!");
    }
  };

  const handleDownloadFile = (filename) => {
    window.open(`${API_URL}/uploads/${filename}`, "_blank");
  };

  const handleLogin = () => {
    if (password === "Abbos2002") {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("❌ Noto‘g‘ri parol!");
      setPassword(""); // Parol noto‘g‘ri bo‘lsa inputni tozalash
    }
  };

  return (
    <div className="App" style={styles.container}>
      {!isAuthenticated ? (
        <div style={styles.loginContainer}>
          <h2>🔑 Parolni kiriting:</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleLogin} style={styles.uploadButton}>
            ✅ Tasdiqlash
          </button>
        </div>
      ) : (
        <>
          <h1>📂 Fayl yuklash tizimi</h1>
          <form onSubmit={handleFileUpload} style={styles.form}>
            <input
              type="file"
              key={fileInputKey}
              multiple
              onChange={handleFileChange}
              style={styles.input}
            />
            <button type="submit" style={styles.button("#28a745")}>
              ⬆️ Yuklash
            </button>
          </form>

          <button onClick={() => setShowFiles(!showFiles)}  style={styles.button("#007bff", "14px", "10px")}>
            {showFiles ? "📁 Yopish" : "📂 Yuklangan Fayllar"}
          </button>

          {showFiles && (
            <ul style={styles.fileList}>
              {uploadedFiles.map((file, index) => (
                <li key={index} style={styles.fileItem}>
                  {file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg") ? (
                    <img src={`${API_URL}/uploads/${file}`} alt={file} style={styles.thumbnail} />
                  ) : file.endsWith(".mp4") || file.endsWith(".mov") ? (
                    <video src={`${API_URL}/uploads/${file}`} controls style={styles.thumbnail} />
                  ) : (
                    <span>{file}</span>
                  )}
                  <button onClick={() => handleDownloadFile(file)} style={styles.button("#17a2b8", "14px", "5px 10px")}>
                    ⬇️ Yuklab olish
                  </button>
                  <button onClick={() => handleDeleteFile(file)} style={styles.button("#dc3545", "14px", "5px 10px")}>
                    🗑️ O‘chirish
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
const styles = {
  container: { textAlign: "center", fontFamily: "Arial, sans-serif", padding: "20px" },
  form: { marginBottom: "20px" },
  input: { marginRight: "10px", padding: "5px" },
  button: (bg, fontSize = "16px", padding = "8px 15px") => ({ backgroundColor: bg, color: "white", border: "none", cursor: "pointer", borderRadius: "5px", fontSize, padding }),
  fileList: { listStyleType: "none", padding: 0 },
  fileItem: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8f9fa", padding: "10px", margin: "5px 0", borderRadius: "5px" },
  thumbnail: { width: "50px", height: "50px", objectFit: "cover" },
  loginContainer: { padding: "20px", border: "1px solid #ccc", borderRadius: "5px", display: "inline-block", backgroundColor: "#f8f9fa" }
};


export default App;


















// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:5057"; // Backend porti

// function App() {
//   const [password, setPassword] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [message, setMessage] = useState("");
//   const [files, setFiles] = useState([]); // Fayllar uchun holat
//   const [uploadedFiles, setUploadedFiles] = useState([]); // Yuklangan fayllar
//   const [showFiles, setShowFiles] = useState(false);
//   const [pendingDeleteFile, setPendingDeleteFile] = useState(null);
//   const [showOkButton, setShowOkButton] = useState(false);
//   const [attempts, setAttempts] = useState(0); // 1️⃣ Xato urinishlar sanog‘i

//   const correctPassword = "123456"; // To‘g‘ri parol

//   // 2️⃣ Parolni tekshirish va urinishlar sonini hisoblash
//   const handleSubmitPassword = (event) => {
//     event.preventDefault();
//     if (password === correctPassword) {
//       setMessage("✅ Kirish muvaffaqiyatli!");
//       setIsLoggedIn(true);
//       fetchUploadedFiles();
//       setAttempts(0); // Urinishlarni qayta nolga tushiramiz
//     } else {
//       setAttempts((prev) => prev + 1);
//       setMessage(`❌ Parol noto‘g‘ri! Urinish: ${attempts + 1}`);
//     }
//   };

//   // 3️⃣ Fayl tanlanganda uni massivga aylantirish
//   const handleFileChange = (event) => {
//     setFiles(Array.from(event.target.files)); // Fayllarni massiv sifatida saqlaymiz
//   };

//   // 4️⃣ Fayllarni serverga yuklash
//   const handleFileUpload = async (event) => {
//     event.preventDefault();
//     if (!files || files.length === 0) {
//       setMessage("⚠️ Fayl tanlanmagan!");
//       return;
//     }

//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append("files", files[i]);
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       if (response.status === 200) {
//         setMessage("✅ Fayllar muvaffaqiyatli yuklandi!");
//         setFiles([]); // Fayllarni tozalaymiz
//         event.currentTarget.reset(); // 5️⃣ Formani tozalash uchun yangilandi
//         fetchUploadedFiles();
//       } else {
//         setMessage("❌ Faylni yuklashda xato!");
//       }
//     } catch (error) {
//       setMessage("🚨 Xatolik yuz berdi!");
//     }
//   };

//   // 6️⃣ Yuklangan fayllarni serverdan olish
//   const fetchUploadedFiles = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/files`);
//       setUploadedFiles(response.data);
//     } catch (error) {
//       setMessage((prevMessage) => prevMessage || "❌ Fayllarni olishda xato!");
//     }
//   };

//   // 7️⃣ Faylni o‘chirishni tasdiqlash
//   const handleDeleteClick = (fileName) => {
//     setPendingDeleteFile(fileName);
//     setShowOkButton(true);
//     setMessage("⚠️ Faylni o‘chirmoqchimisiz? OK tugmasini bosing!");
//   };

//   // 8️⃣ Tasdiqlangandan so‘ng faylni o‘chirish
//   const handleOkClick = async () => {
//     if (pendingDeleteFile) {
//       try {
//         const response = await axios.delete(`${API_URL}/api/files/${pendingDeleteFile}`);
//         if (response.status === 200) {
//           setMessage("✅ Fayl o‘chirildi!");
//           fetchUploadedFiles();
//         } else {
//           setMessage("❌ Faylni o‘chirishda xato!");
//         }
//       } catch (error) {
//         setMessage("🚨 Xatolik yuz berdi!");
//       }
//       setPendingDeleteFile(null);
//     }
//     setShowOkButton(false);
//   };

//   // 9️⃣ Yuklab olish xabarini chiqarish
//   const handleDownloadClick = () => {
//     setShowOkButton(true);
//     setMessage("✅ Fayl yuklab olinmoqda! OK tugmasini bosing.");
//   };

//   return (
//     <div className="App">
//       {!isLoggedIn ? (
//         <div>
//           <h1>Parolni kiriting:</h1>
//           <form onSubmit={handleSubmitPassword}>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Parolni kiriting"
//             />
//             <button type="submit">Yuborish</button>
//           </form>
//         </div>
//       ) : (
//         <div>
//           <h2>Fayllarni yuklang:</h2>
//           <form onSubmit={handleFileUpload}>
//             <input type="file" multiple onChange={handleFileChange} />
//             <button type="submit">Yuklash</button>
//           </form>

//           <button onClick={() => setShowFiles(!showFiles)}>
//             {showFiles ? "📂 Yuklangan fayllarni yashirish" : "📂 Yuklangan fayllar"}
//           </button>

//           {showFiles && (
//             <div>
//               <h2>Yuklangan Fayllar:</h2>
//               <ul>
//                 {uploadedFiles.map((file, index) => {
//                   const fileUrl = `${API_URL}/uploads/${file}`;
//                   return (
//                     <li key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                       <a href={fileUrl} download={file} onClick={handleDownloadClick}>
//                         <button>⬇️ Yuklab olish</button>
//                       </a>
//                       <button onClick={() => handleDeleteClick(file)}>❌ O‘chirish</button>
//                       <span>{file}</span>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           )}

//           {showOkButton && <button onClick={handleOkClick}>✅ OK</button>}
//         </div>
//       )}
//       <p>{message}</p>
//     </div>
//   );
// }

// export default App;





