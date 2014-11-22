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
        public static string GeefLangeId(string id)
        {
            return id.PadLeft(10, '0');
        }

        public async Task<object> SendEmailToAttendee(dynamic attendee)
        {
            var barcodeNummer = GeefLangeId((string)attendee.Id);
            var pdfByteArray = CreatePdf.PdfToByte(barcodeNummer);
            return pdfByteArray;
        }
    }
}
