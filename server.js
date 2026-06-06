const mysql= require('mysql2/promise')
const express = require('express')
const path = require('path')
const { Login, Dashboard } = require('./LoginAndDashboard')
const { UserBooking, UserEV, UserBattery } = require('./UserModule')
const { CompanyGrid } = require('./CompanyModule')
const { AdminGrid, AdminUser, AdminCompany, AdminEV, AdminEVSE } = require('./AdminModule')
const { Reports } = require('./Utils')
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
//-------------------------------------------------------------------------

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


//USER MODULE----------------------------------------------------------------
//user module - booking
app.get('/allBookings', (req, res) => {
    return UserBooking.allBookings(req, res, connection)
})

app.get('/stationNames', (req, res) => {
    return UserBooking.stationNames(req, res, connection)
})

app.get('/timeSlots', (req, res) => {
    return UserBooking.timeSlots(req, res, connection)
})

app.get('/booking', (req, res) => {
    return UserBooking.booking(req, res, connection)
})

app.post('/addBooking', (req, res) => {
    return UserBooking.addBooking(req, res, connection)
})

app.post('/completeBooking', (req, res) => {
    return UserBooking.completeBooking(req, res, connection)
})

app.post('/updateBooking', (req, res) => {
    return UserBooking.updateBooking(req, res, connection)
})

app.post('/deleteBooking', (req, res) => {
    return UserBooking.deleteBooking(req, res, connection)
})

//user module - ev
app.get('/userEVs', (req, res) => {
  return UserEV.userEVs(req, res, connection)
})

//user module - battery
app.get('/userEVBatteries', (req, res) => {
  return UserBattery.userEVBatteries(req, res, connection)
})


//Company MODULE--------------------------------------------------------------
//company module - grid
app.get('/allRequests', (req, res) => {
  return CompanyGrid.allRequests(req, res, connection)
})

app.post('/addRequest', (req, res) => {
  return CompanyGrid.addRequest(req, res, connection)
})

app.post('/updateRequest', (req, res) => {
  return CompanyGrid.updateRequest(req, res, connection)
})

app.post('/deleteRequest', (req, res) => {
  return CompanyGrid.deleteRequest(req, res, connection)
})

app.post('/acceptRequest', (req, res) => {
  return CompanyGrid.acceptRequest(req, res, connection)
})

app.post('/completeRequest', (req, res) => {
  return CompanyGrid.completeRequest(req, res, connection)
})


//ADMIN MODULE--------------------------------------------------------------
//admin module - grid
app.get('/adminAllRequests', (req, res) => {
  return AdminGrid.adminAllRequests(req, res, connection)
})

app.post('/adminDeleteRequest', (req, res) => {
  return AdminGrid.adminDeleteRequest(req, res, connection)
})

//admin module - user
app.get('/allUsers', (req, res) => {
  return AdminUser.allUsers(req, res, connection)
})

app.get('/user', (req, res) => {
  return AdminUser.user(req, res, connection)
})

app.post('/addUser', (req, res) => {
  return AdminUser.addUser(req, res, connection)
})

app.post('/updateUser', (req, res) => {
  return AdminUser.updateUser(req, res, connection)
})

app.post('/deleteUser', (req,res) => {
  return AdminUser.deleteUser(req, res, connection)
})

//admin module - company
app.get('/allCompanies', (req, res) => {
  return AdminCompany.allCompanies(req, res, connection)
})

app.get('/company', (req, res) => {
  return AdminCompany.company(req, res, connection)
})

app.post('/addCompany', (req, res) => {
  return AdminCompany.addCompany(req, res, connection)
})

app.post('/updateCompany', (req, res) => {
  return AdminCompany.updateCompany(req, res, connection)
})

app.post('/deleteCompany', (req,res) => {
  return AdminCompany.deleteCompany(req, res, connection)
})

//admin module - EV
app.get('/allEVs', (req, res) => {
  return AdminEV.allEVs(req, res, connection)
})

app.get('/ev', (req, res) => {
  return AdminEV.ev(req, res, connection)
})

app.post('/addEV', (req, res) => {
  return AdminEV.addEV(req, res, connection)
})

app.post('/updateEV', (req, res) => {
  return AdminEV.updateEV(req, res, connection)
})

app.post('/deleteEV', (req,res) => {
  return AdminEV.deleteEV(req, res, connection)
})

//admin module - EVSE
app.get('/allEVSEs', (req, res) => {
  return AdminEVSE.allEVSEs(req, res, connection)
})

app.get('/evse', (req, res) => {
  return AdminEVSE.evse(req, res, connection)
})

app.post('/addEVSE', (req, res) => {
  return AdminEVSE.addEVSE(req, res, connection)
})

app.post('/updateEVSE', (req, res) => {
  return AdminEVSE.updateEVSE(req, res, connection)
})

app.post('/deleteEVSE', (req,res) => {
  return AdminEVSE.deleteEVSE(req, res, connection)
})


//UTILS MODULE--------------------------------------------------------------
//Utils module - reports
app.get('/allReports', (req, res) => {
  return Reports.allReports(req, res, connection)
})

app.post('/addReport', (req, res) => {
  return Reports.addReport(req, res, connection)
})

app.post('/updateReport', (req, res) => {
  return Reports.updateReport(req, res, connection)
})

//--------------------------------------------------------------------------


