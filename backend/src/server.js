const app = require('../app');
const Port = process.env.port || 5000;
app.listen(Port, () => {
    console.log("server started");
})