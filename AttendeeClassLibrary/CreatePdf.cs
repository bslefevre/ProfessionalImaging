using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using System.Diagnostics;
using System.IO;
using System.Drawing;
using System.Threading.Tasks;
using System.Text;
using PdfSharp.Pdf.IO;

namespace AttendeeClassLibrary
{
    public class CreatePdf
    {
        public async Task<object> Invoke(dynamic input)
        {
            var id = (int)input.attendeeId;

            using (PdfDocument document = new PdfDocument())
            {
                document.Info.Title = "Barcode generator";
                XFont font = new XFont("Verdana", 16);

                PdfPage page = document.AddPage();
                XGraphics gfx = XGraphics.FromPdfPage(page);

                //// Draw the text
                gfx.DrawString(string.Format("Onderstaande barcode heeft uniek nummer: {0}", id), font, XBrushes.Black,
                  new XRect(20, 20, 200, 20),
                  XStringFormats.TopLeft);
                //var image = XImage.FromFile(string.Format("{0}.jpg", id));

                //gfx.DrawImage(image, new XRect(20, 40, image.PixelWidth, image.PixelHeight));
                //// Save the document...
                var filename = string.Format("ProfessionalImaging2015_{0}.pdf", id);
                document.Save(filename);
            }

            return true;
            //// ...and start a viewer.
            //Process.Start(filename);
        }

        public static byte[] PdfToByte(string barcodeNummer)
        {
            using (PdfDocument document = PdfReader.Open("toegangsticket PI 2015.pdf"))
            {
                document.Info.Title = "Barcode generator";
                XFont font = new XFont("Verdana", 16);

                PdfPage page = document.Pages[0];
                XGraphics gfx = XGraphics.FromPdfPage(page);

                string windowsTempPath = Path.GetTempPath();
                var fileLocation = string.Format("{0}.jpg", Path.GetTempFileName());
                var secondFileLocation = string.Format("{0}.jpg", Path.GetTempFileName());
                
                var bigBarcode = CreateBarcode.Create(barcodeNummer, new Size(210, 90));

                bigBarcode.Save(fileLocation);

                var pageHalfWidth = page.Width / 2;

                using (var xImage = XImage.FromFile(fileLocation))
                {
                    var imageHalfWidth = xImage.PixelWidth / 2;
                    gfx.DrawImage(xImage, new XRect(pageHalfWidth - imageHalfWidth, page.Height - xImage.PixelHeight - 45, xImage.PixelWidth, xImage.PixelHeight));
                }

                var smallBarcode = CreateBarcode.Create(barcodeNummer, new Size(170, 87));

                smallBarcode.RotateFlip(RotateFlipType.Rotate90FlipNone);
                smallBarcode.Save(secondFileLocation);

                using (var xImage = XImage.FromFile(secondFileLocation))
                {
                    var imageHalfWidth = xImage.PixelWidth / 2;
                    gfx.DrawImage(xImage, new XRect(page.Width - xImage.PixelWidth - 33, 280, xImage.PixelWidth, xImage.PixelHeight));
                }

                byte[] fileContents = null;
                using (MemoryStream stream = new MemoryStream())
                {
                    document.Save(stream, true);
                    fileContents = stream.ToArray();
                }

                return fileContents;
            }
        }
    }
}
