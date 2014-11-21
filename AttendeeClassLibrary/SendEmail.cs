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
            MailMessage mail = new MailMessage(new MailAddress("doggiehostmaster@gmail.com", "Björn le Fèvre"),
                    new MailAddress(attendee.Emailaddress, string.Format("{0} {1}", attendee.Initials, attendee.Surname)));
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("doggiehostmaster@gmail.com", "kj94km6112"),
                EnableSsl = true
            };
            mail.Subject = "Registratie";
            mail.Body = "Hallo daar, hier ff een testje :-)";
            var barcodeNummer = GeefLangeId((string)attendee.Id);
            //var pdf = new MemoryStream(CreatePdf.PdfToByte(barcodeNummer, CreateBarcode.Create(barcodeNummer)));

            //mail.Attachments.Add(new Attachment(pdf, string.Format("{0} - ProfessionalImaging - Registratie.pdf", DateTime.Today.ToString("yyyyMMdd"))));
            client.Send(mail);

            return true;
        }
    }
}
