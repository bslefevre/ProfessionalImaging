var connectionString = 'Data Source=THUNDER;Initial Catalog=ProfessionalImaging;User Id=sa;Password =Welkom01;';
/*
 * GET home page.
 */

function User(name, email) {
    this.name = name;
    this.email = email;
}

// Dummy users
//var users = [
//    new User('tj', 'tj@vision-media.ca')
//  , new User('ciaran', 'ciaranj@gmail.com')
//  , new User('aaron', 'aaron.heckmann+github@gmail.com')
//];
var edge = require('edge');

var attendeeList = [];

var getAttendee = edge.func('sql', {
    source: function () {/*
    SELECT * FROM Attendee
    ORDER BY CreatedDateTime DESC
    */
    },
    //connectionString: connectionString
});

var users = getAttendee(null, function (error, result) {
    if (error) { logError(error, res); return; }
    if (result) {
        
        result.forEach(function (attendee) {
            attendeeList.push(attendee);
        });

        return result;
    }
    else {
    }
});

var lazyRead = function () {
    var lazy = require("lazy"),
        fs = require("fs");
    
    var moment = require('moment');
    var ft = require('file-tail').startTailing('C:\\temp\\capture.txt');
    ft.on('line', function (line) {
        var result = line.split(",");
        result[0] = result[0].replace(/['"]+/g, '');
        result[0] = moment(result[0], "DD-MM-YYYY HH-mm-ss");
        
        var scannedAttendee = new ScannedAttendee(result[0], result[1])
        console.log(JSON.stringify(scannedAttendee));
    });
};

function ScannedAttendee(dateTime, barcode){
    this.Barcode = barcode;
    this.DateTime = dateTime;
}

exports.index = function (req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
    lazyRead();
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.' });
};

exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page.' });
};

exports.attendee = function (req, res) {
    
    //testInsert();
    
    getAttendee(null, function (error, result) {
        if (error) { logError(error, res); return; }
        if (result) {
            result.forEach(function (attendee) {
                attendeeList.push(attendee);
            });
            
            res.render('attendee', { title: 'Bezoekers', year: new Date().getFullYear(), message: 'Bezoekers lijst', attendeeList: result });
        }
        else {
        }
    })
    
};

var counter = 0;

var testInsert = function () {
    if (counter <= 1)
    {
        testInsertValues(null, function (error, result) {
            if (error) throw error;
            if (result) {
                if (result == 1) {
                    counter++;
                    testInsert();
                }
            }
        });
    }
};

var testInsertValues = edge.func('sql', function () {/*
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
           ,[Processed])
     VALUES
           ('Test'
           ,'Test'
           ,'Test'
           ,'Test'
           ,'l@l.nl'
           ,0
           ,0
           ,0
           ,'Test'
           ,0)
*/});