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
const fs = require('fs');

dotenv.config();
const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "http://localhost:3000"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"]
        }
    },
    frameguard: {
        action: 'deny'
    },
    xssFilter: true,
    noSniff: true
}));

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

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'uit2027goo',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        sameSite: 'lax' 
    }
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "img-src 'self' http://localhost:3000 data:;");
    next();
});

app.use('/', homeRouter);
app.use('/product', productRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
