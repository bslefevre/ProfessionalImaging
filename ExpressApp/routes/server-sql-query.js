//var express = require('express');
//var app = express();
//var http = require('http');
//var port = process.env.PORT || 8080;
//var edge = require('edge');
//var path = require('path');
//app.use(express.bodyParser());
//var cors = require('cors');
//app.use(express.urlencoded());
//app.use(express.json());


// SETX EDGE_SQL_CONNECTION_STRING "Data Source=localhost;Initial Catalog=ProfessionalImaging;Integrated Security=True";

var getAttendee = edge.func('sql', function () {/*
    SELECT * FROM Attendee
*/
});

var getPerson = edge.func(function () {/*
    using System.Threading.Tasks;

    public class Person
    {
        public int anInteger = 1;
        public double aNumber = 3.1415;
        public string aString = "foo";
        public bool aBoolean = true;
        public byte[] aBuffer = new byte[10];
        public object[] anArray = new object[] { 1, "foo" };
        public object anObject = new { a = "foo", b = 12 };
    }

    public class Startup
    {
        public async Task<object> Invoke(dynamic input)
        {
            Person person = new Person();
            return person;
        }
    }
*/
});

var attendeeClassLibrary = path.join(__dirname, 'bin', 'AttendeeClassLibrary.dll');

var clrMethod = edge.func({
    assemblyFile: process.env.PORT ? 'bin/AttendeeClassLibrary.dll' : attendeeClassLibrary,
    typeName: 'AttendeeClassLibrary.Startup',
    methodName: 'Invoke'
});

var generatePdf = edge.func({
    assemblyFile: process.env.PORT ? 'bin/AttendeeClassLibrary.dll' : attendeeClassLibrary,
    typeName: 'AttendeeClassLibrary.CreatePdf',
    methodName: 'Invoke'
});

var sendEmailToAttendee = edge.func({
    assemblyFile: process.env.PORT ? 'bin/AttendeeClassLibrary.dll' : attendeeClassLibrary,
    typeName: 'AttendeeClassLibrary.SendEmail',
    methodName: 'SendEmailToAttendee'
})

function logError(err, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Error: " + err);
    res.end("");
}

function initial(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    getAttendee(null, function (error, result) {
        if (error) { logError(error, res); return; }
        if (result) {
            res.write("<ul>");
            result.forEach(function (attendee) {
                var value = "<li>" + attendee.Initials + " " + attendee.Surname + ": " + attendee.Emailaddress + "</li>";
                console.log(value);
                res.write(value);
            });
            res.end("</ul>");
        }
        else {
        }
    });
    
    //var data = { pageNumber: '2', pageSize: 3 };
    
    //clrMethod(data, function (error, result) {
    //    if (error) throw error;
    //    console.log(result);
    //});

}

//app.get('/', initial);

app.post('/rest/getBarcodeNumber', cors(), function (req, res) {
    console.log(JSON.stringify(req.body));
    //console.log(req._remoteAddress);

    if (!req.body.hasOwnProperty('s'))
    {
 // || !req.body.hasOwnProperty('text')
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    
    var newQuote = {
        pageNumber : req.body.s,
        //text : req.body.text
    };
    
    clrMethod(newQuote, function (error, result) {
        if (error) throw error;
        console.log(result);
        res.json(result);
    });
});

//app.use(function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//    next();
//});





//http.createServer(app).listen(port);
//console.log("Node server listening on port " + port);