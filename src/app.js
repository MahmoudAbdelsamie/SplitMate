require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const prisma = require('./config/database')

const authRouter = require('./routes/authRoutes');

const app = express();

//middlewares
app.use(cors());
app.use(bodyParser.json());



// default endpoint...

app.get('/api/v1', (req, res) => {
    res.json({
        message: "Welcome to SplitMate API!!"
    });
});

app.use('/api/v1', authRouter)

// DB Connection test...

app.get('/test-db', async (req, res) => {
    try {
        const test = await prisma.user.findMany();
        res.json({
            data: test
        });
    } catch(err) {
        res.status(500).json({
            error: 'Database Connection failed!',
            details: err.message
        });
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


