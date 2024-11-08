import axios from 'axios';

const API_URL = "https://api-inference.huggingface.co/models/google-t5/t5-base";
const headers = { Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}` };

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { inputs } = req.body;

      // Check if inputs is provided and is a string
      if (!inputs || typeof inputs !== 'string') {
        return res.status(400).json({ error: "Invalid input format. 'inputs' should be a non-empty string." });
      }

      // Log payload for debugging
      console.log("Sending payload:", { inputs });

      // Send request to Hugging Face API
      const response = await axios.post(API_URL, { inputs }, { headers });
      const result = response.data;
console.log('result is ',result);
      return res.status(200).json(result);
    }  catch (error) {
        console.error("Error during translation:", error?.response?.data || error.message);
        return res.status(500).json({ error: "Translation failed", details: error?.response?.data || error.message });
      }
      
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
