
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

var getAttendee = edge.func('sql', function () {/*
    SELECT * FROM Attendee
*/
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
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.' });
};

exports.contact = function (req, res) {
    
    users();

    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page.' });
};

exports.attendee = function (req, res) {
    res.render('attendee', { title: 'Bezoekers', year: new Date().getFullYear(), message: 'Bezoekers lijst', attendeeList: attendeeList });
};