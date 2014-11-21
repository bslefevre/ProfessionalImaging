
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var edge = require('edge');
var cors = require('cors');

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
var queryPath = path.join(__dirname, 'routes', 'server-sql-query.js');
eval(fs.readFileSync(queryPath) + '');

var pdfCreator = path.join(__dirname, 'routes', 'pdfCreator.js');
eval(fs.readFileSync(pdfCreator) + '');

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/bezoekers', routes.attendee);

function Attendee(contract, bedrijfsnaam, voorletters, achternaam, emailadres, zaterdag, zondag, maandag, passepartout){
    this.contract = contract;
    this.bedrijfsnaam = bedrijfsnaam;
    this.voorletters = voorletters;
    this.achternaam = achternaam;
    this.emailadres = emailadres;
    this.zaterdag = zaterdag;
    this.zondag = zondag;
    this.maandag = maandag;
    this.passepartout = passepartout;
}

app.post('/rest/insertAttendee', cors(), function (req, res) {
    //res.charset = 'utf-8';
    //console.log(JSON.stringify(req.body));

    var attendee = new Attendee(req.body.contract,
        req.body.bedrijfsnaam,
        req.body.voorletters,
        req.body.achternaam,
        req.body.emailadres,
        req.body.zaterdag,
        req.body.zondag,
        req.body.maandag,
        req.body.passepartout);

    console.log(JSON.stringify(attendee));
    
    //insertAttendee(attendee, function (error, result) {
    //    if (error) { logError(error, res); return; }
    //    if (result) {
    //        if (result == 1) {
    //            res.json(true);
    //        }
    //    }
    //    else {
    //    }
    //});
    //res.statusCode = 200;
    res.json(attendee);
});


var insertAttendee = edge.func('sql', function () {/*
    INSERT INTO [dbo].[Attendee]
           ([Contract]
           ,[Company]
           ,[Initials]
           ,[Surname]
           ,[Emailaddress]
           ,[Zaterdag]
           ,[Zondag]
           ,[Maandag]
           ,[PassePartout])
     VALUES
           (@contract
		   , @bedrijfsnaam
		   , @voorletters
		   , @achternaam
		   , @emailadres
		   , @zaterdag
		   , @zondag
		   , @maandag
		   , @passepartout)
*/
});

//var CronJob = require('cron').CronJob;
//new CronJob('0,30 * * * * *', function () {
    
//    var currentdate = new Date();
//    var datetime = "Last Sync: " + currentdate.getDate() + "/" 
//                + (currentdate.getMonth() + 1) + "/" 
//                + currentdate.getFullYear() + " @ " 
//                + currentdate.getHours() + ":" 
//                + currentdate.getMinutes() + ":" 
//                + currentdate.getSeconds();

//    console.log('You will see this message every 30 seconds');
//    console.log('The datetime is:: ' + currentdate);


//}, null, true);

app.post('/rest/generatePdf', cors(), function (req, res) {
    var newData = {
        attendeeId : req.body.attendeeId
    };
    
    generatePdf(newData, function (error, result) {
        if (error) throw error;
        console.log(result);
        res.json(result);
    });
});

app.post('/rest/sendEmailToAttendee', cors(), function (req, res) {
    var attendee = {
        'Id': req.body.id,
        'Initials': req.body.initials,
        'Surname': req.body.surname,
        'Emailaddress': req.body.emailaddress,
    };
    sendEmailToAttendee(attendee, function (error, result) {
        if (error) throw error;
        console.log(result);
        res.json(result);
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});