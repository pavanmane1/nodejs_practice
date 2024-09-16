const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const routes = require('./Routes/routes')
const PORT = process.env.PORT || 8080;
const app = express();

// Use CORS middleware before defining your routes
const allowedOrigins = [
    'https://react-stock-manegment-system.onrender.com', // Production origin
    'http://localhost:3000' // Local development origin
];

app.use(cors({
    origin: function (origin, callback) {
        // Check if the incoming origin is in the allowedOrigins array or if there's no origin (for non-browser requests)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true // Allow cookies or credentials
}));



app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
