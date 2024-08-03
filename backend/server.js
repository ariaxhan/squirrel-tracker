require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Replicate = require("replicate");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  }),
);

app.use(express.static("public"));

app.post("/process-image", upload.single("image"), async (req, res) => {
  console.log("Received request to /process-image");
  if (!req.file) {
    console.log("No file uploaded");
    return res.status(400).json({ error: "No image file uploaded" });
  }
  const imagePath = req.file.path;
  try {
    console.log("Reading file:", imagePath);
    const imageBase64 = await fs.readFile(imagePath, { encoding: "base64" });
    const imageDataURI = `data:${req.file.mimetype};base64,${imageBase64}`;
    const input = {
      image: imageDataURI,
      top_p: 1,
      prompt: "Are there any police officers in this photo? Identify each one",
      max_tokens: 1024,
      temperature: 0.2,
    };
    console.log("Sending request to Replicate");
    const output = await replicate.run(
      "yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
      { input },
    );
    console.log("Received response from Replicate");
    // Clean up
    await fs.unlink(imagePath);
    res.json(output);
  } catch (error) {
    console.error("Error processing image:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the image" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
