require('dotenv').config();
const mongoose = require('mongoose').connect(process.env.MONGODB_URI);
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
const port = process.env.SERVER_PORT || 3000;

const userRoute = require('./routes/userRoute');
app.use('/api', userRoute);

const authRoute = require('./routes/authRoute');
app.use('/', authRoute);


app.listen(3000, () => {
    console.log('listening on 3000')
});