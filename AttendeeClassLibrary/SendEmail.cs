using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace AttendeeClassLibrary
{
    public class SendEmail
    {
        public static string GeefLangeId(int id)
        {
            return id.ToString().PadLeft(10, '0');
        }

        public async Task<object> SendEmailToAttendee(dynamic attendee)
        {
            var barcodeNummer = GeefLangeId((int)attendee.Id);
            var pdfByteArray = CreatePdf.PdfToByte(barcodeNummer);
            return pdfByteArray;
        }

        public async Task<object> PrintToGoogleCloudPrinter(dynamic attendee)
        {
            var attendeeId = (int)attendee.Id;
            var barcodeNummer = GeefLangeId(attendeeId);
            var pdfByteArray = CreatePdf.PdfToByte(barcodeNummer);
            var fileName = string.Format("{0} - {1} - {2} {3}", barcodeNummer, "Toegangsticket PI 2015", attendee.voornaam, attendee.achternaam);
            var printerName = (bool)attendee.inTest ? "Save to Google Docs" : "Brother HL-5450DN";
            var cloudPrint = new GoogleCloudPrint("basewebtek-youreontime-v1");
            cloudPrint.UserName = "doggiehostmaster@gmail.com";
            cloudPrint.Password = "kj94km6112";
            var printers = cloudPrint.Printers;
            var printer = printers.printers.FirstOrDefault(x => x.name == printerName);
            if (printer == null) return string.Format("Printer '{0}' kan niet gevonden worden", printerName);
            var result = cloudPrint.PrintDocument(printer.id, fileName, pdfByteArray, "application/pdf");
            return string.Format("Id:: {0}. Success:: {1}. Printer:: '{2}'. Result:: {3}", attendeeId, result.success, printerName, result.message);
        }
    }
}
