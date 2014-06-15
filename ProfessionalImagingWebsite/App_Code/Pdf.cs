using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using System.Diagnostics;
using System.IO;
using System.Drawing;

public static class Pdf
{
	public static void Generate(string id)
	{
        PdfDocument document = new PdfDocument();
        document.Info.Title = "Barcode generator";
        XFont font = new XFont("Verdana", 16);

        PdfPage page = document.AddPage();
        XGraphics gfx = XGraphics.FromPdfPage(page);

        // Draw the text
        gfx.DrawString(string.Format("Onderstaande barcode heeft uniek nummer: {0}", id), font, XBrushes.Black,
          new XRect(20, 20, 200, 20),
          XStringFormats.TopLeft);
        var image = XImage.FromFile(string.Format("{0}.jpg", id));

        gfx.DrawImage(image, new XRect(20, 40, image.PixelWidth, image.PixelHeight));
        // Save the document...
        var filename = string.Format("ProfessionalImaging2015_{0}.pdf", id);
        document.Save(filename);

        // ...and start a viewer.
        Process.Start(filename);
	}

    public static byte[] PdfToByte(string id, byte[] barcode)
    {
        PdfDocument document = new PdfDocument();
        document.Info.Title = "Barcode generator";
        XFont font = new XFont("Verdana", 16);

        PdfPage page = document.AddPage();
        XGraphics gfx = XGraphics.FromPdfPage(page);
        
        // Draw the text
        gfx.DrawString(string.Format("Onderstaande barcode heeft uniek nummer: {0}", id), font, XBrushes.Black,
          new XRect(20, 20, 200, 20),
          XStringFormats.TopLeft);
        
        string windowsTempPath = Path.GetTempPath();
        var fileLocation = string.Format("{0}{1}.jpg", windowsTempPath, id);
        
        using (var image = Image.FromStream(new MemoryStream(barcode)))
        {
            image.Save(fileLocation);
        }
        
        var xImage = XImage.FromFile(fileLocation);
        gfx.DrawImage(xImage, new XRect(20, 40, xImage.PixelWidth, xImage.PixelHeight));

        byte[] fileContents = null;
        using (MemoryStream stream = new MemoryStream())
        {
            document.Save(stream, true);
            fileContents = stream.ToArray();
        }

        return fileContents;
    }
}