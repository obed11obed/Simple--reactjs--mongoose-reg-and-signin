import express from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import session from 'express-session';
import cors from 'cors'


const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your React app's URL
    credentials: true
}));

// Setup session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Ensure the cookie is only accessible by the web server
        secure: false,  // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auth_demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', UserSchema);




// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('Username already taken');
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).send('User registered');
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(400).send('Invalid username or password');
    }

    req.session.userId = user._id;
    res.status(200).send('Login successful');
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.status(401).send('You need to log in to access this page');
    }
}

// Profile endpoint
app.get('/profile', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    res.status(200).json({ username: user.username });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out');
        } else {
            res.status(200).send('Logout successful');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000; // Use a different port for backend
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});