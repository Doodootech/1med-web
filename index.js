//imports
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const server = require('http').createServer(index);
// const io = require('socket.io')(index);

//routes

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const textsRoutes = require('./routes/texts');

//express setup

const app = express();

// VIEW ENGINE SETUP //
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//setup bcrypt

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);
// Store hash in your password DB.

//mongoDB connecttion
const URI ='mongodb+srv://techphila:pass2020@1medapp.nfoitse.mongodb.net/?retryWrites=true&w=majority'

// MONGOOSE CONNECTION
mongoose
  .connect(URI, {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(
  session({
    secret: 'thisisajustarandomkeywordforexpression',
    resave: false,
    saveUninitialized: false
  })
);

// APPENDING THE PUBLIC FOLDER
app.use(express.static(path.join(__dirname, '/public')));

// BODY-PARSER SETUP
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(methodOverride('_method'));
//using routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/texts', textsRoutes)

// SERVER
app.listen(process.env.PORT || 4010, err => {
    console.log('Server started');
  });
