const express = require('express');
const cors = require('cors');
const summarizeText = require('./summarize');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Enable CORS to allow requests from your frontend

app.post('/summarize', async (req, res) => {
    const textToSummarize = req.body.text;

    try {
        const summary = await summarizeText(textToSummarize);
        res.send({ summary });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: 'Failed to summarize text' });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
