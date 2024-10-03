const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const homeRouter = require('./routes/home.router.js');
const productRouter = require('./routes/product.router.js');
const paymentRouter = require('./routes/payment.router.js');
const fs = require('fs');
const https = require('https');

dotenv.config();

const app = express();
const options = {
    key: fs.readFileSync('./ssl/private.key'),
    cert: fs.readFileSync('./ssl/certificate.crt')
};

// Middleware
app.use(fileUpload({ createParentPath: true }));
app.use(helmet());
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'uit2027goo',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true in production
        sameSite: 'lax'
    }
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

const httpsServer = https.createServer(options, app);
const io = require('socket.io')(httpsServer);

io.on('connection', (socket) => {
    socket.on('chatMessage', (from, msg) => {
        io.emit('chatMessage', from, msg);
    });
    socket.on('notifyUser', (user) => {
        io.emit('notifyUser', user);
    });
});

app.use('/', homeRouter);
app.use('/product', productRouter);
app.use('/payment', paymentRouter);
app.get('/favicon.ico', (req, res) => res.status(204));

const PORT = process.env.PORT || 3000;

httpsServer.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
