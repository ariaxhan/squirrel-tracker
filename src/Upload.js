import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a preview URL for the selected image
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      console.log("Sending request to server");
      const response = await axios.post(
        `http://localhost:3000/process-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Received response:", response.data);
      setResult(response.data.join("")); // Join the array elements into a single string
    } catch (err) {
      console.error(
        "Error details:",
        err.response ? err.response.data : err.message,
      );
      setError(`An error occurred while processing the image: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload and Process"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {previewUrl && (
        <div className="image-preview">
          <h3>Uploaded Image:</h3>
          <img src={previewUrl} alt="Uploaded preview" />
        </div>
      )}
      {result && (
        <div className="result-card">
          <h3>Result:</h3>
          <p className="result-text">{result}</p>
        </div>
      )}
    </div>
  );
}

export default Upload;
