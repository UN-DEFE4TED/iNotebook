const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT; 

const connectToMongo = require("./db");
connectToMongo();

const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);
 
app.listen(port, ()=>{
    console.log(`Listing at http://localhost${port}`);
})
