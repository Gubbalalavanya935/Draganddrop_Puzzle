const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Add this line to enable CORS
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/puzzleGameDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the schema for game completions
const completionSchema = new mongoose.Schema({
    turns: Number,
});

const Completion = mongoose.model('Completion', completionSchema);

app.post('/saveCompletion', async (req, res) => {
    const turns = req.body.turns;

    try {
        const newCompletion = new Completion({ turns });
        const savedCompletion = await newCompletion.save();

        console.log(`Completion saved to MongoDB with ID: ${savedCompletion._id}`);
        res.status(200).json({ message: 'Completion saved to MongoDB', completionId: savedCompletion._id });
    } catch (error) {
        console.error('Error saving completion to MongoDB:', error);
        res.status(500).send('Error saving completion to MongoDB');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
