const app = require('./app');
const connectDB = require('./config/db');

require('dotenv').config();

connectDB();

const Port = process.env.PORT || 5000;
app.listen(Port, () => {
    console.log("server started");
})