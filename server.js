const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors=require("cors")
const app = express();
app.use(cors())
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiBaseUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

app.use(express.json());

app.get("/",(req,res)=>{
  try {
    res.send({msg:"hello world"})
  } catch (error) {
    res.send({msg:error.message})
  }
})

app.post('/generate-shayari', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required.' });
  }

  try {
    const prompt = `Write a Shayari on "${keyword}"`;

    const response = await axios.post(
      openaiBaseUrl,
      {
        prompt,
        max_tokens: 100, // Adjust the number of tokens as per your requirement
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    const shayari = response.data.choices[0]?.text;

    if (!shayari) {
      return res.status(500).json({ error: 'Failed to generate Shayari.' });
    }

    res.json({ shayari });
  } catch (err) {
    console.error('Error generating Shayari:', err.message);
    res.status(500).json({ error: 'Failed to generate Shayari.' });
  }
});

app.listen(process.env.port, () => {
  console.log(`Server is running on http://localhost:${process.env.port}`);
});
