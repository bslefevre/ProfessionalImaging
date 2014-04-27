using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using Zen.Barcode;
using Zen.Barcode.SSRS;

public static class Barcode
{
    public static byte[] Create(string barcodeNumber)
    {
        var barcodeImageBuilder = new BarcodeImageBuilder();
        barcodeImageBuilder.Text = barcodeNumber; //"0123456789";
        barcodeImageBuilder.Symbology = BarcodeSymbology.Code128;

        return barcodeImageBuilder.GetBarcodeImage();
        //var imageBytes =
        //Image image = null;
        //try
        //{
        //    image = Image.FromStream(new MemoryStream(imageBytes));
        //}
        //catch (ArgumentException)
        //{
        //}
        //var filename = string.Format(@"{0}/{1}.jpg", "file://C:/temp", barcodeImageBuilder.Text);
        //Environment.CurrentDirectory
        
        //return image;
        //image.Save(filename);
    }
}