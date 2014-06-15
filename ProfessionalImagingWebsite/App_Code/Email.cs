using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;

public static class Email
{
	public static void Create(Attendee attendee)
	{
        MailMessage mail = new MailMessage(new MailAddress("doggiehostmaster@gmail.com", "Björn le Fèvre"),
                new MailAddress(attendee.Emailaddress, string.Format("{0} {1}", attendee.Initials, attendee.Surname)));
        var client = new SmtpClient("smtp.gmail.com", 587)
        {
            Credentials = new NetworkCredential("doggiehostmaster@gmail.com", "PASSWORD"),
            EnableSsl = true
        };
        mail.Subject = "Registratie";
        mail.Body = "Hallo daar, hier ff een testje :-)";

        var pdf = new MemoryStream(Pdf.PdfToByte(Bezoeker.GeefLangeId(attendee.Id.ToString()), Bezoeker.GeefBarcode(attendee.Id, attendee.Barcode)));

        mail.Attachments.Add(new Attachment(pdf, "testPdf.pdf"));
        client.Send(mail);
	}
}