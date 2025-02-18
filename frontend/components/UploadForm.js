// frontend/src/components/UploadForm.js
import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Faylni tanlang");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5057/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.message) {
        alert(data.message);
      }
    } catch (err) {
      console.error("Xato yuz berdi:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Yuklash</button>
    </form>
  );
};


export default UploadForm;
