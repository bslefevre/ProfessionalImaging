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

namespace AttendeeClassLibrary
{
    public class CreatePdf
    {
        public async Task<object> Invoke(dynamic input)
        {
            var id = (string)input.attendeeId;

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

        public static byte[] PdfToByte(string id, byte[] barcode)
        {
            return null; 
            //using (PdfDocument document = new PdfDocument())
            //{
            //    document.Info.Title = "Barcode generator";
            //    XFont font = new XFont("Verdana", 16);

            //    PdfPage page = document.AddPage();
            //    XGraphics gfx = XGraphics.FromPdfPage(page);

            //    var sb = new StringBuilder();
            //    sb.AppendLine("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel ipsum libero. Donec purus erat, aliquam sed orci a, mollis dictum urna. Maecenas gravida placerat euismod. Nullam dapibus ligula a commodo sodales. In accumsan sem a nibh accumsan, condimentum bibendum odio tristique. Praesent non quam aliquam, varius nulla lacinia, malesuada nunc. Quisque faucibus tempor arcu, id pulvinar dolor posuere in.");
            //    sb.AppendLine();
            //    sb.AppendLine("Donec lacinia lacinia risus, a dignissim nisl posuere at. Donec semper, orci ac interdum ultrices, ex purus pellentesque magna, nec ultrices orci elit sed urna. Cras vestibulum dolor in erat dictum, nec sollicitudin risus ultrices. Nam id fermentum sem. Aliquam vulputate in purus ut feugiat. Nullam feugiat varius imperdiet. Maecenas at justo placerat, luctus elit a, mollis magna.");

            //    // Draw the text
            //    gfx.DrawString("The following paragraph was rendered using BlaBla:", font, XBrushes.Black,
            //      new XRect(100, 100, page.Width - 200, 300),
            //      XStringFormats.TopLeft);

            //    // You always need a MigraDoc document for rendering.
            //    //Document doc = new Document();
            //    //Section sec = doc.AddSection();
            //    //// Add a single paragraph with some text and format information.
            //    //Paragraph para = sec.AddParagraph();
            //    //para.Format.Alignment = ParagraphAlignment.Justify;
            //    //para.Format.Font.Name = "Times New Roman";
            //    //para.Format.Font.Size = 12;
            //    //para.Format.Font.Color = MigraDoc.DocumentObjectModel.Colors.DarkGray;
            //    //para.Format.Font.Color = MigraDoc.DocumentObjectModel.Colors.DarkGray;
            //    //para.AddText("Duisism odigna acipsum delesenisl ");
            //    //para.AddFormattedText("ullum in velenit", TextFormat.Bold);
            //    //para.AddText(" ipit iurero dolum zzriliquisis nit wis dolore vel et nonsequipit, velendigna "+
            //    //"auguercilit lor se dipisl duismod tatem zzrit at laore magna feummod oloborting ea con vel "+
            //    //"essit augiati onsequat luptat nos diatum vel ullum illummy nonsent nit ipis et nonsequis "+
            //    //"niation utpat. Odolobor augait et non etueril landre min ut ulla feugiam commodo lortie ex "+
            //    //"essent augait el ing eumsan hendre feugait prat augiatem amconul laoreet. ≤≥≈≠");
            //    //para.Format.Borders.Distance = "5pt";
            //    //para.Format.Borders.Color = Colors.Gold;

            //    //// Create a renderer and prepare (=layout) the document
            //    //MigraDoc.Rendering.DocumentRenderer docRenderer = new DocumentRenderer(doc);
            //    //docRenderer.PrepareDocument();

            //    //// Render the paragraph. You can render tables or shapes the same way.
            //    //docRenderer.RenderObject(gfx, XUnit.FromCentimeter(5), XUnit.FromCentimeter(10), "12cm", para);

            //    string windowsTempPath = Path.GetTempPath();
            //    var fileLocation = string.Format("{0}{1}.jpg", windowsTempPath, id);

            //    using (var image = Image.FromStream(new MemoryStream(barcode)))
            //    {
            //        image.Save(fileLocation);
            //    }

            //    using (var xImage = XImage.FromFile(fileLocation))
            //    {
            //        gfx.DrawImage(xImage, new XRect(20, 40, xImage.PixelWidth, xImage.PixelHeight));
            //    }

            //    byte[] fileContents = null;
            //    using (MemoryStream stream = new MemoryStream())
            //    {
            //        document.Save(stream, true);
            //        fileContents = stream.ToArray();
            //    }

            //    return fileContents;
            //}
        }
    }
}
