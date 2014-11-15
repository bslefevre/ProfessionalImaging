using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Zen.Barcode;
using Zen.Barcode.SSRS;

namespace AttendeeClassLibrary
{
    public class CreateBarcode
    {
        public static byte[] Create(string barcodeNumber)
        {
            var barcodeImageBuilder = new BarcodeImageBuilder();
            barcodeImageBuilder.Text = barcodeNumber; //"0123456789";
            barcodeImageBuilder.Symbology = BarcodeSymbology.Code128;

            return barcodeImageBuilder.GetBarcodeImage();
        }
    }
}
