
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

//var phantom = require('phantom');
//var createDan = function createPdf() {
//    phantom.create(function (ph) {
//        ph.createPage(function (page) {
//            page.open(fs.createWriteStream("C:\tmp\test\o_9af8ee24cb817759.html"), function (status) {
//                console.log("opened google? ", status);
                
//                page.set('paperSize', {
//                    format: 'A4'
//                }, function () {
//                    // continue with page setup
//                });

//                page.render('/tmp/file2.pdf', function () {
//                    // file is now written to disk
//                    console.log('Page Rendered');
//                    ph.exit();
//                });                
                
//                //page.evaluate(function () { return document.title; }, function (result) {
//                //    console.log('Page title is ' + result);


//                //    ph.exit();
//                //});

//                //ph.exit();
                
//            });
//        });
//    }, {
//        dnodeOpts: {
//            weak: false
//        }
//    });
//}

//var fs = require('fs');

//var webkitThingy = function () {
//    var wkhtmltopdf = require('wkhtmltopdf');
//    wkhtmltopdf('http://google.com/', { pageSize: 'letter' }).pipe(fs.createWriteStream('out.pdf'));
//}


/// NOPE
//var htmlToPdf = function () {
//    var path = require('path');
//    var htmlToPdf = require('html-to-pdf');

//    htmlToPdf.setDebug(true);
    
//    var rootlocation = path.join(__dirname, 'o_9af8ee24cb817759.html');
//    var destlocation = path.join(__dirname, 'destination.pdf');

//    htmlToPdf.convertHTMLFile(rootlocation, destlocation,
//        function (error, success) {
//            if (error) {
//                console.log('Oh noes! Errorz!');
//                console.log(error);
//            } else {
//                console.log('Woot! Success!');
//                console.log(success);
//            }
//        }
//    );
//};


// PDF KIT TODO
//var fs = require('fs');
//var PDFDocument = require('pdfkit');
//var doc = new PDFDocument();

//doc.pipe = fs.createWriteStream('C:/tmp/toegangsticket PI 2015.pdf');                          

//var pdf = require('pdfcrowd');
//var doPdfCrowd = function () {
//    var client = new pdf();
//    client.convertFile('C:\tmp\test\o_9af8ee24cb817759.html', pdf.saveToFile("example_com.pdf"));
//};

//var replaceStream = require('replacestream');

//var getStream = function () {
    
//    return fs.createReadStream('mailtext.html');
//};

//var nodemailer = require('nodemailer');
//var transporter = nodemailer.createTransport();

//var sendMail = function () {
//    var text = ' Geachte [ENTERNAME]. <br />'+
//    '<br />' +
//'Hartelijk dank voor uw aanmelding.<br />' +
//'In bijlage treft u uw gratis toegangsbewijs aan.<br />' +
//'Print deze ticket zodanig uit dat de barcode leesbaar is en neem het mee bij uw bezoek aan de beurs.<br />' +
//'Komt u meerdere dagen dan deze ticket per dag laten scannen.<br />' +
//'<br />' +
//'Tot ziens op 28, 29 of 30 maart.<br />' +
//'<br />' +
//'Met vriendelijke groet, <br />' +
//'Organisatie Professional Imaging 2015.✔';
    
//    var mailOptions = {
//        from: 'Ticket ✔ <ticket@professionalimaging.nl>', // sender address
//        to: 'Balletje balletje <doggiehostmaster@gmail.com>', // list of receivers
//        subject: 'TOEGANGSBEWIJS PROFESSIONAL IMAGING 2015 ✔', // Subject line
//        text: text, // plaintext body
//        html: text, // html body
//        attachments: {
//            filename: 'Toegangsticket PI 2015.pdf',
//            content: fs.createReadStream('toegangsticket PI 2015.pdf')
//        }
//    };
    
//    transporter.sendMail(mailOptions, function (error, info) {
//        if (error) {
//            console.log('Error: ' + error);
//        } else {
//            console.log('Message sent to: ' + JSON.stringify(info.envelope.to));
//        }
//    });
//};

exports.index = function (req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
    //createDan();
    //sendMail();
    //htmlToPdf();
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