﻿var connectionString = 'Data Source=THUNDER;Initial Catalog=ProfessionalImaging;User Id=sa;Password =Welkom01;';
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

var getSearchedAttendee = edge.func('sql', {
    source: function () {/*
SELECT * FROM Attendee
WHERE(@company = ''OR Company LIKE CONCAT('%', @company, '%'))
AND(@initials = ''OR Initials LIKE CONCAT('%', @initials, '%'))
AND (@surname = '' OR Surname LIKE CONCAT('%', @surname, '%'))
AND (@emailaddress = '' OR Emailaddress LIKE CONCAT('%', @emailaddress, '%'))
    */},
    //connectionString: connectionString
});

var getamountOfRegisteredAttendee = edge.func('sql', {
    source: function () {/*
    SELECT COUNT(*) as Amount FROM Attendee
    */},
    //connectionString: connectionString
});

var getAttendeeCountOfToday = edge.func('sql', {
    source: function () {/*
SELECT CONVERT(varchar, CreatedDateTime, 105) as CreatedDateTime, COUNT(Id) as Amount
FROM Attendee
WHERE CreatedDateTime IS NOT NULL
AND CONVERT(varchar, CreatedDateTime, 105) = CONVERT(varchar, GETDATE(), 105)
GROUP BY CONVERT(varchar, CreatedDateTime, 105)
*/
    },
    //connectionString: connectionString
});

var getScannedBarcodeCountPerDay = edge.func('sql', {
    source: function () {/*
SELECT CONVERT(varchar, barcode.CreatedDateTime, 105) as CreatedDateTime, COUNT(DISTINCT(id)) as Scanned,
(
  SELECT COUNT(*) FROM Attendee
  WHERE (Zaterdag = 1 AND CONVERT(varchar, barcode.CreatedDateTime, 105) = '15-01-2015')
  OR (Zondag = 1 AND CONVERT(varchar, barcode.CreatedDateTime, 105) = '16-01-2015')
  OR (Maandag = 1 AND CONVERT(varchar, barcode.CreatedDateTime, 105) = '17-01-2015')
) as Predicted,
COUNT(Id) as Total
FROM ScannedBarcodes barcode
WHERE barcode.CreatedDateTime IS NOT NULL
GROUP BY CONVERT(varchar, barcode.CreatedDateTime, 105)
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

exports.index = function (req, res) {
    getamountOfRegisteredAttendee(null, function (error, result) {
        if (error) { logError(error, res); return; }
        if (result) {
            var amountOfRegisteredAttendee = result[0].Amount;
            getAttendeeCountOfToday(null, function (error, result) {
                if (error) { logError(error, res); return; }
                var attendeeCountOfToday = 0;
                if (result && result.length == 1) {
                    attendeeCountOfToday = result[0].Amount;
                }
                
                
                getScannedBarcodeCountPerDay(null, function (error, result) {
                    var scannedAttendeeCountArray = [];
                    if (error) throw error;
                    if (result) {
                        result.forEach(function (thing) {
                            scannedAttendeeCountArray.push(thing);
                        });
                    }

                    res.render('index', { title: 'Home', year: new Date().getFullYear(), amountOfRegisteredAttendee: amountOfRegisteredAttendee, attendeeCountOfToday: attendeeCountOfToday, scannedAttendeeCountArray: scannedAttendeeCountArray });
                });
            });
        }
    });
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.' });
};

exports.contact = function (req, res) {
    res.render('registration', { title: 'Registratie', year: new Date().getFullYear() });
};

exports.scan = function (req, res) {
    res.render('scan', { title: 'Scan', year: new Date().getFullYear() });
};

exports.scannedAttendee = function (req, res) {
    res.render('scannedAttendee', { title: 'Gescande bezoekers', year: new Date().getFullYear(), jsFile: 'countPerDay.js' });
};

var ietsIngevuld = function (attendee) {
    return (attendee.initials && attendee.initials != '') ||
        (attendee.surname && attendee.surname != '') ||
        (attendee.company && attendee.company != '') ||
        (attendee.emailaddress && attendee.emailaddress != '')
};

exports.search = function (req, res) {
    var searchedAttendeeList = [];
    
    if (req.method === "POST" && ietsIngevuld(req.body)) {
        getSearchedAttendee(req.body, function (error, result) {
            if (error) { logError(error, res); return; }
            if (result) {
                result.forEach(function (attendee) {
                    searchedAttendeeList.push(attendee);
                });
                res.render('search', { title: 'Zoek', message: 'Zoek hier je gebruikers', year: new Date().getFullYear(), attendeeList: searchedAttendeeList });
            }
        });
    } else {
        res.render('search', { title: 'Zoek', message: 'Zoek hier je gebruikers', year: new Date().getFullYear(), attendeeList: [] });
    }
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