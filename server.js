// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
// We should be using a .env file for the key, however this project isn't going anywhere.
const GEMINI_API_KEY = 'AIzaSyA75ZsO7z3Von528RK3I_P8G8ZzsW_hULU'; // 

app.use(cors());
app.use(express.json({ limit: '20mb' })); // Increase limit for image payloads

app.post('/api/describe', async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || !images.length) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const base64Image = images[0]; // Raw Base64 string from client
    
    
    // The mimeType should match what you generate in script.js (image/jpeg)
    const payload = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image, // Pass the raw base64 data
                mimeType: "image/jpeg"
              }
            },
            { // change the text prompt for our needs
              text: 'Please describe this image as if a blind person wanted to know what it was. Please no headings or werid characters and remember to keep it short and sweeet! ' 
            }
          ]
        }
      ]
    };
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
      API_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extracts description from the response
    const description = response.data?.candidates?.[0]?.content?.parts?.[0]?.text 
                       || response.data?.text // Sometimes the response is simplified
                       || 'No description returned.';
                       
    res.json({ description });
    
  } catch (err) {
    // This logs the whole error in the browser console if something goes wrong.
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to process the image. Check the server console for details.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});