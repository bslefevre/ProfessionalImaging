
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
var moment = require('moment');
var connectionString = 'Data Source=THUNDER;Initial Catalog=ProfessionalImaging;User Id=sa;Password =Welkom01;';
var validator = require('validator');

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());

express.logger.format('dev', function (tokens, req, res) {
    var status = res.statusCode
    , color = 32;
    
    if (status >= 500) color = 31
    else if (status >= 400) color = 33
    else if (status >= 300) color = 36;
    
    var remoteAddr = getRemoteAddr(req);
    var dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    
    var logText = '\x1b[90m' + req.method 
    + ' ' + dateTime
    + ' ' + remoteAddr
    + ' ' + req.originalUrl + ' '
    + '\x1b[' + color + 'm' + res.statusCode 
    + ' \x1b[90m' 
    + (new Date- req._startTime) 
    + 'ms'
    + '\x1b[0m';
    
    var userAgent = req.headers['user-agent'];

    var allLoggingText = [];
    allLoggingText.push(req.method);
    allLoggingText.push(status.toString());
    allLoggingText.push(dateTime);
    allLoggingText.push(remoteAddr);
    allLoggingText.push(req.originalUrl);
    allLoggingText.push(userAgent);

    fs.appendFile(__dirname + '/logging/' + moment().format('YYYY-MM-DD') + '_debug.csv', toLongString(allLoggingText) + '\n');

    return logText;
});

var toLongString = function (stringArray) {
    var item, i;
    var line = [];
    
    for (i = 0; i < stringArray.length; ++i) {
        item = stringArray[i];
        item = item.replace(';', '');
        if (item.indexOf && (item.indexOf(',') !== -1 || item.indexOf('"') !== -1)) {
            item = '"' + item.replace(/"/g, '""') + '"';
        }
        line.push(item);
    }

    return line;
}

var getRemoteAddr = function (req) {
    if (req.ip) return req.ip;
    if (req._remoteAddress) return req._remoteAddress;
    var sock = req.socket;
    if (sock.socket) return sock.socket.remoteAddress;
    return sock.remoteAddress;
};

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
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

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/bezoekers', routes.attendee);

function Attendee(contract, voornaam, achternaam, bedrijfsnaam, emailadres, zaterdag, zondag, maandag, professie, nieuwsbrief, createdDateTime){
    this.contract = contract;
    this.voornaam = voornaam;
    this.achternaam = achternaam;
    this.bedrijfsnaam = bedrijfsnaam;
    this.emailadres = emailadres;
    this.zaterdag = zaterdag;
    this.zondag = zondag;
    this.maandag = maandag;
    this.professie = professie;
    this.nieuwsbrief = nieuwsbrief;
    this.createdDateTime = createdDateTime;
}

app.get('/info/bezoekersPerDag', cors(), function (req, res) {
    fs.readFile('./AmountPerDay.html', function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

app.get('/info/bezoekersPerProfessie', cors(), function (req, res) {
    fs.readFile('./AmountPerProfession.html', function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

app.get('/info/aantalPerDag', cors(), function (req, res) {
    fs.readFile('./CountPerDay.html', function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

app.get('/info/aantalPerMaand', cors(), function (req, res) {
    fs.readFile('./CountPerMonth.html', function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

app.get('/info/aantalPerUur', cors(), function (req, res) {
    fs.readFile('./CountPerHour.html', function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

app.get('/info/bar', cors(), function (req, res) {
    fs.readFile('./TestBar.html', function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

app.get('/info/pie', cors(), function (req, res) {
    fs.readFile('./TestPie.html', function (error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});


app.get('/rest/getAttendeeCount', cors(), function (req, res) {
    getAttendeeCount(null, function (error, result) {
        if (error) throw error;
        if (result.length == 1) {
            res.json(result[0]);
        }
    });
});

app.get('/rest/getAttendeePerProfessionCount', cors(), function (req, res) {
    getAttendeePerProfessionCount(null, function (error, result) {
        if (error) throw error;
        if (result.length == 1) {
            res.json(result[0]);
        }
    });
});

app.get('/rest/getAttendeeCountPerDay', cors(), function (req, res) {
    getAttendeeCountPerDay(null, function (error, result) {
        if (error) throw error;
        if (result.length > 0) {
            var attendeeCountArray = [];
            result.forEach(function (attendee) {
                attendeeCountArray.push([attendee.CreatedDateTime, attendee.Amount]);
            });
            return res.json(attendeeCountArray);
        }
    });
});

app.get('/rest/getAttendeeCountPerMonth', cors(), function (req, res) {
    getAttendeeCountPerMonth(null, function (error, result) {
        if (error) throw error;
        if (result.length > 0) {
            var attendeeCountArray = [];
            result.forEach(function (attendee) {
                attendeeCountArray.push([attendee.CreatedDateTime, attendee.Amount]);
            });
            return res.json(attendeeCountArray);
        }
    });
});

app.get('/rest/getAttendeeCountPerHour', cors(), function (req, res) {
    getAttendeeCountPerHour(null, function (error, result) {
        if (error) throw error;
        if (result.length > 0) {
            var attendeeCountArray = [];
            result.forEach(function (attendee) {
                attendeeCountArray.push([attendee.CreatedDateTime, attendee.Amount]);
            });
            return res.json(attendeeCountArray);
        }
    });
});

app.post('/rest/resendRegistration', cors(), function (req, res) {
    var emailadres = req.body.emailaddress;
    
    
    checkOpBestaandEmailAdres({ 'emailadres': emailadres }, function (error, result) {
        var bestaatEmailAdres = false;
        
        if (error) { throw error; }
        if (result) {
            if (result.length > 0) bestaatEmailAdres = true;
        }
        
        if (!bestaatEmailAdres) {
            res.statusCode = 418;
            res.json('E-mail bestaat niet in de database.');
            return;
        }
        updateAttendeeByEmailForResend({ 'emailadres': emailadres }, function (error, result) {
            if (error) { throw error; }
            if (result) {
                
                console.log('Mail will be resend to: ' + emailadres);
                res.statusCode = 200;
                res.json('E-mail wordt opnieuw verstuurd');
            }
        });
    });

});

app.post('/rest/insertAttendee', cors(), function (req, res) {
    var attendee = new Attendee('ProfessionalImaging',
        validator.trim(req.body.voornaam),
        validator.trim(req.body.achternaam),
        validator.trim(req.body.bedrijfsnaam),
        validator.trim(req.body.emailadres),
        validator.trim(req.body.zaterdag),
        req.body.zondag,
        req.body.maandag,
        req.body.professie,
		req.body.nieuwsbrief,
        moment().format('YYYY-MM-DD HH:mm:ss'));

    console.log(JSON.stringify(attendee));

    if (req.body.inTest === "true") {
        res.json(true);
        console.log('Applicatie is in test');
        return;
    }
    
    if (!validator.isEmail(attendee.emailadres)) {
        res.status(418).send('Geen geldig emailadres ingevoerd.');
        return;
    }
    
    if (!validator.isLength(attendee.voornaam, 1) || !validator.isLength(attendee.achternaam, 1) || !validator.isLength(attendee.emailadres, 1)) {
        res.status(418).send('Een of meerdere van de verplichte velden hebben geen waarde.');
        return;
    }

    checkOpBestaandEmailAdres(attendee, function (error, result) {
        var bestaatEmailAdres = false;
        
        if (error) { logError(error, res); return; }
        if (result) {
            if (result.length > 0) bestaatEmailAdres = true;
        }

        if (bestaatEmailAdres) {
            res.status(418).send('E-mail bestaat al in de database.');
            return;
        }

        insertAttendee(attendee, function (error, result) {
            if (error) { logError(error, res); return; }
            if (result) {
                if (result == 1) {
                    res.json(true);
                    console.log('Toegevoegd');
                }
            }
            else {
            }
        });
    });
});

var checkOpBestaandEmailAdres = edge.func('sql', function () { /*
SELECT Emailaddress FROM Attendee
WHERE Emailaddress = @emailadres;
*/
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
           ,[Profession]
		   ,[Nieuwsbrief]
           ,[CreatedDateTime])
     VALUES
           (@contract
		   , @bedrijfsnaam
		   , @voornaam
		   , @achternaam
		   , @emailadres
		   , @zaterdag
		   , @zondag
		   , @maandag
		   , @professie
		   , @nieuwsbrief
           , @createdDateTime)
*/
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var CronJob = require('cron').CronJob;
new CronJob('0,30 * * * * *', function () {
    
    //var currentdate = new Date();
    //var datetime = "Last Sync: " + currentdate.getDate() + "/" 
    //            + (currentdate.getMonth() + 1) + "/" 
    //            + currentdate.getFullYear() + " @ " 
    //            + currentdate.getHours() + ":" 
    //            + currentdate.getMinutes() + ":" 
    //            + currentdate.getSeconds();
    //console.log('You will see this message every 30 seconds');
    //console.log('The datetime is:: ' + currentdate);
    sendMailToUnprocessedAttendee();

}, null, true);

var sendMailToUnprocessedAttendee = function () {
    getUnprocessedAttendee(null, function (error, result) {
        if (error) { throw error; }
        if (result) {
            var hoeveelMails = result.length;
            var hoeveelheidGoed = 0;
            if (hoeveelMails == 0) return;
            
            console.log('===========================================================================');
            console.log('=========================== Bezoeker verwerking ===========================');
            console.log('===========================================================================');
            console.log('Hoeveelheid onverwerkt:: ' + hoeveelMails);
            result.forEach(function (attendee) {
                sendEmailToAttendee(attendee, function (error, result) {
                    if (error) throw error;
                    var mailOptions = createMailToSend(result, attendee);
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            attendee.Error = error.message;
                            updateAttendeeAfterUnsuccessfullMailSend(attendee, function (updateError, result) {
                                if (updateError) throw updateError;
                                if (result) {
                                    console.log('Error: ' + error);
                                }
                            });
                        } else {
                            var message = 'Message sent to: ' + JSON.stringify(info.envelope.to);
                            console.info(message);
                            updateAttendeeAfterSuccesfullMailSend(attendee, function (error, result) {
                                if (error) throw error;
                                if (result) {
                                    hoeveelheidGoed++;
                                    console.log('Hoeveelheid goed verwerkt:: ' + hoeveelheidGoed);
                                    if (hoeveelMails == hoeveelheidGoed) {
                                        console.log('===========================================================================');
                                        console.log('=========================== Alles goed verwerkt ===========================');
                                        console.log('===========================================================================');
                                    }
                                }
                            });
                        }

                        hoeveelMails--;
                        if (hoeveelMails == 0) {
                            console.log('===========================================================================');
                            console.log('================================== DONE ===================================');
                            console.log('===========================================================================');
                        }
                    });
                });
            });
        }
    });
};

var createMailToSend = function (streamValue, attendee) {
    var name = attendee.Initials + ' ' + attendee.Surname;
    
    var text = ' Geachte ' + name + '. <br />' +
        '<br />' +
    'Hartelijk dank voor uw aanmelding.<br />' +
    'In bijlage treft u uw gratis toegangsbewijs aan.<br />' +
    'Print deze ticket zodanig uit dat de barcode leesbaar is en neem het mee bij uw bezoek aan de beurs.<br />' +
    'Komt u meerdere dagen dan deze ticket per dag laten scannen.<br />' +
    '<br />' +
    'Tot ziens op 28, 29 of 30 maart.<br />' +
    '<br />' +
    'Met vriendelijke groet, <br />' +
    'Organisatie Professional Imaging 2015.';
    
    var mailOptions = {
        from: 'Professional Imaging 2015 <ticket@professionalimaging.nl>', // sender address ✔
        to: name + ' <' + attendee.Emailaddress + '>', // list of receivers
        subject: 'TOEGANGSBEWIJS PROFESSIONAL IMAGING 2015', // Subject line
        text: text, // plaintext body
        html: text, // html body
        attachments: {
            filename: 'Toegangsticket PI 2015.pdf',
            content: streamValue
        }
    };
    
    return mailOptions;
};

var updateAttendeeByEmailForResend = edge.func('sql', function () { /*
UPDATE Attendee
Set Processed = 0
WHERE Emailaddress = @emailadres
*/
});

var updateAttendeeAfterUnsuccessfullMailSend = edge.func('sql', function () {/*
UPDATE Attendee
Set Errorlog = @Error,
Processed = -1
WHERE Id = @Id;
*/
});

var updateAttendeeAfterSuccesfullMailSend = edge.func('sql', function () { /*
UPDATE Attendee
SET Processed = 1
WHERE Id = @Id;
*/
});

var getUnprocessedAttendee = edge.func('sql', function () { /*
SELECT * FROM Attendee
WHERE Processed = 0;
*/
});

var getAttendeeCount = edge.func('sql', function () {/*
SELECT Zaterdag, Zondag, Maandag
FROM (SELECT COUNT(Zaterdag) as Zaterdag FROM Attendee WHERE Zaterdag = 1) Zaterdag
CROSS JOIN (SELECT COUNT(Zondag) as Zondag FROM Attendee WHERE Zondag = 1) Zondag
CROSS JOIN (SELECT COUNT(Maandag) as Maandag FROM Attendee WHERE Maandag = 1) Maandag
*/
});

var getAttendeePerProfessionCount = edge.func('sql', {
    source: function () {/*
SELECT ft, pt, am, st
FROM (SELECT COUNT(Profession) as ft FROM Attendee WHERE Profession = 'ft') ft
CROSS JOIN (SELECT COUNT(Profession) as pt FROM Attendee WHERE Profession = 'pt') pt
CROSS JOIN (SELECT COUNT(Profession) as am FROM Attendee WHERE Profession = 'am') am
CROSS JOIN (SELECT COUNT(Profession) as st FROM Attendee WHERE Profession = 'st') st
*/
    },
    //connectionString: connectionString
});

var getAttendeeCountPerDay = edge.func('sql', {
    source: function () {/*
SELECT CONVERT(varchar, CreatedDateTime, 105) as CreatedDateTime, COUNT(Id) as Amount
FROM Attendee
WHERE CreatedDateTime IS NOT NULL
GROUP BY CONVERT(varchar, CreatedDateTime, 105)
*/
    },
    //connectionString: connectionString
});

var getAttendeeCountPerMonth = edge.func('sql', {
    source: function () {/*
SELECT SUBSTRING(CONVERT(varchar, CreatedDateTime, 105), 4, 10) as CreatedDateTime, COUNT(Id) as Amount
FROM Attendee
WHERE CreatedDateTime IS NOT NULL
GROUP BY SUBSTRING(CONVERT(varchar, CreatedDateTime, 105), 4, 10)
*/
    },
    //connectionString: connectionString
});

var getAttendeeCountPerHour = edge.func('sql', {
    source: function () {/*
SELECT SUBSTRING(CONVERT(varchar, CreatedDateTime, 120), 12, 2) as CreatedDateTime, COUNT(Id) as Amount
FROM Attendee
WHERE CreatedDateTime IS NOT NULL
GROUP BY SUBSTRING(CONVERT(varchar, CreatedDateTime, 120), 12, 2)
*/
    },
    //connectionString: connectionString
});

var number = 0;
app.post('/rest/generatePdf', cors(), function (req, res) {
    var newData = {
        attendeeId : number //req.body.attendeeId
    };
    number++;
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
        console.info('Daar gaan we');
        //sendMail(result, attendee, res);       
    });
});

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var smtpTransportOptions =
{
    host: 'mail.professionalimaging.nl',
    port: 25,
    secure: false,
    auth: {
        user: 'ticket@professionalimaging.nl',
        pass: 'Qfwk96_8'
    },
    tls: {rejectUnauthorized: false},
    debug:true
};

var transporter = nodemailer.createTransport(smtpTransport(smtpTransportOptions));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});