const mysql= require('mysql2/promise')
const express = require('express')
const path = require('path')
const { Login, Dashboard } = require('./LoginAndDashboard')
const { User } = require('./UserModule')
var app = express()
const port = 9000

//app.use()-------------------------------------------------------------------
app.listen(port, () => console.log(`Server listening on port ${port}!`))
app.use(express.static(path.join(__dirname, '/frontend')))
app.use(express.json())
app.use(express.urlencoded({ extended: true}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

//database connection-----------------------------------------------------
try{
    var connection=mysql.createPool({
      host:'localhost',
      user:'root',
      password:'0000',
      database:'SmartVolt2',
    });
    console.log('Database connected.');
}
catch(err){
    console.log('Error connecting to database.\n'+ err);
}
//----------------------------------------------------------

//login and dashboard
app.get('/auth', (req, res) => {
    return Login.auth(req, res, connection)
})

app.post('/register', (req, res) => {
    return Login.register(req, res, connection)
})

app.get('/userEV', (req, res) => {
    return Dashboard.userEV(req, res, connection)
})

app.get('/companyStation', (req, res) => {
    return Dashboard.companyStation(req, res, connection)
})

app.get('/adminStation', (req, res) => {
    return Dashboard.adminStation(req, res, connection)
})

//user booking module
app.get('/allBookings', (req, res) => {
    return User.allBookings(req, res, connection)
})

app.get('/stationNames', (req, res) => {
    return User.stationNames(req, res, connection)
})

app.get('/timeSlots', (req, res) => {
    return User.timeSlots(req, res, connection)
})

app.get('/booking', (req, res) => {
    return User.booking(req, res, connection)
})

app.post('/addBooking', (req, res) => {
    return User.addBooking(req, res, connection)
})

app.post('/updateBooking', (req, res) => {
    return User.updateBooking(req, res, connection)
})

app.get('/deleteBooking', (req, res) => {
    return User.deleteBooking(req, res, connection)
})

