const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const express = require("express");
const Waiters = require('./waiter');

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://sim:pg123@localhost:5432/coffee_shop';

const pool = new Pool({
    connectionString
});

// create my app
const app = express();
// const RegFactory = require('./greetingsRoutes');

const waiters = Waiters(pool);



// view engine setup
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// initialise session middleware - flash-express depends on it
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());


// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // for parsing application/json
app.use(bodyParser.json())

//this will make server instance to find css in the public folder
app.use(express.static('public'))


app.get("/", async function(req, res) {

    res.render("waiter");
});

app.get("/waiters/:username", async function(req, res) {

    res.render("waiter", {

    });
});

app.post("/waiters/:username", async function(req, res) {
    let nameField = req.body.nameField
    let workday = req.body.workday

    // var add = await waiters.addShiftWF(nameField, workday)

    if (workday != undefined || workday != [] && nameField != '' || nameField != undefined) {
        req.flash('success', "Your shift has been added. Thank you!")
    }
    // else if (!workday && !nameField) {
    //     req.flash('error', "Please enter your name and select your day shifts")
    // }
    res.render("waiter", {
        // addWaiters: add
    });

});

app.get("/days", async function(req, res) {

    res.render("admin");
});



//telling the server what port to listen on
let PORT = process.env.PORT || 2012;

// when a server listen it uses port number: 3011
app.listen(PORT, function() {
    console.log('App starting on port:', PORT);

});