
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

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/bezoekers', routes.attendee);

function Attendee(contract, voornaam, achternaam, bedrijfsnaam, emailadres, zaterdag, zondag, maandag, professie){
    this.contract = contract;
    this.voornaam = voornaam;
    this.achternaam = achternaam;
    this.bedrijfsnaam = bedrijfsnaam;
    this.emailadres = emailadres;
    this.zaterdag = zaterdag;
    this.zondag = zondag;
    this.maandag = maandag;
    this.professie = professie;
}

app.get('/rest/getAttendeeCount', cors(), function (req, res) {

    getAttendeeCount(null, function (error, result) {
        if (error) throw error;
        if (result.length == 1) {
            res.json(result[0]);
        }
    });
});

app.post('/rest/insertAttendee', cors(), function (req, res) {
    var attendee = new Attendee('ProfessionalImaging',
        req.body.voornaam,
        req.body.achternaam,
        req.body.bedrijfsnaam,
        req.body.emailadres,
        req.body.zaterdag,
        req.body.zondag,
        req.body.maandag,
        req.body.professie);

    console.log(JSON.stringify(attendee));
    
    checkOpBestaandEmailAdres(attendee, function (error, result) {
        var bestaatEmailAdres = false;
        
        if (error) { logError(error, res); return; }
        if (result) {
            if (result.length > 0) bestaatEmailAdres = true;
        }

        if (bestaatEmailAdres) {
            res.statusCode = 400;
            res.send('E-mail bestaat al in de database.');
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
           ,[Profession])
     VALUES
           (@contract
		   , @bedrijfsnaam
		   , @voornaam
		   , @achternaam
		   , @emailadres
		   , @zaterdag
		   , @zondag
		   , @maandag
		   , @professie)
*/
});

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
        from: 'Ticket <ticket@professionalimaging.nl>', // sender address ✔
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
        sendMail(result, attendee, res);       
    });
});

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();

var sendMail = function (streamValue, attendee) {
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
        from: 'Ticket ✔ <ticket@professionalimaging.nl>', // sender address
        to: name +' <' + attendee.Emailaddress + '>', // list of receivers
        subject: 'TOEGANGSBEWIJS PROFESSIONAL IMAGING 2015', // Subject line
        text: text, // plaintext body
        html: text, // html body
        attachments: {
            filename: 'Toegangsticket PI 2015.pdf',
            content: streamValue
        }
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error: ' + error);
            return false;
        } else {
            var message = 'Message sent to: ' + JSON.stringify(info.envelope.to);
            console.info(message);
            return true;
        }
    });
};


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});