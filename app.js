const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;
const app = express();
const userRoutes = require("./Routes/userRoutes");
app.use(bodyParser.json());

app.use('/', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
