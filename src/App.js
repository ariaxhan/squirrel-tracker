import React from "react";
import "./App.css";
import Upload from "./Upload";
import { useState } from "react";

function App() {
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadClick = () => {
    setShowUpload(true);
  };

  return (
    <div className="container">
      <div className="content">
        <h1>Police Tracker</h1>
        <p>We see you too.</p>
        {!showUpload ? (
          <button onClick={handleUploadClick}>Upload</button>
        ) : (
          <Upload />
        )}
      </div>
      <br /> <br /> <br /> <br /> <br />
      {/* <div className="police"></div>
      <div className="ant"></div> */}
      {/* <div className="gun-image gun-1"></div>
      <div className="gun-image gun-2"></div>
      <div className="gun-image gun-3"></div> */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
      <div className="blob blob-5"></div>
    </div>
  );
}

export default App;
