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
    }
}
