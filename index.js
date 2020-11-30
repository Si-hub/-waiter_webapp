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

    res.render("home");
});

app.get("/login", async function(req, res) {


    res.render("");
});

app.get("/sign-up", async function(req, res) {


    res.render("");
});

app.get('/waiters/:username', async function(req, res, next) {

    try {
        let userName = req.params.username
        userName = userName.toUpperCase().charAt(0) + userName.slice(1);

        let getuser = await waiters.getWaiter(userName)
        let weekdays = await waiters.getDays(userName);
        let shift = await waiters.daysForUserChecked(userName)
            // console.log(weekdays)
        res.render("waiter", {
            daynames: shift,
            username: userName,
            getuser
        });
    } catch (error) {
        next(error);
    }
});

app.post('/waiters/:username', async function(req, res) {
    let username = req.params.username

    let workday = req.body.workday;

    await waiters.getDays(username);

    // var add = await waiters.addWaiter(nameField, workday)
    await waiters.addShift(username, workday)

    if (workday != undefined || workday != [] && username != '' || username != undefined) {
        req.flash('success', "Your shift has been added. Thank you!")
    } else {
        req.flash('error', "Please enter your name and select your day shifts")
    }

    res.redirect('/waiters/' + username);

});

app.get("/days", async function(req, res) {
    let groupdays = await waiters.grounamepedShifts();

    res.render("days", {
        groupdays
    });
});

app.get('/clear', async function(req, res) {

    await waiters.deleteShifts();
    req.flash('success', 'You have Succesfully deleted shift');
    res.redirect('days');
});


//telling the server what port to listen on
let PORT = process.env.PORT || 2012;

// when a server listen it uses port number: 3011
app.listen(PORT, function() {
    console.log('App starting on port:', PORT);

});