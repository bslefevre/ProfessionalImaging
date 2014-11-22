using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Zen.Barcode;

namespace AttendeeClassLibrary
{
    public class CreateBarcode
    {
        public static Image Create(string barcodeNumber, Size size) //byte[]
        {
            //var barcodeImageBuilder = new BarcodeImageBuilder();
            Code128BarcodeDraw bla = BarcodeDrawFactory.Code128WithChecksum;

            var printMetrics = bla.GetPrintMetrics(size, size, 10);
            var image = bla.Draw(barcodeNumber, printMetrics);

            return image;
            //barcodeImageBuilder.Text = barcodeNumber; //"0123456789";
            //barcodeImageBuilder.Symbology = BarcodeSymbology.Code128;

            //return barcodeImageBuilder.GetBarcodeImage();
        }
    }
}
