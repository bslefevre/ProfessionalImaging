using System;
using System.IO;
using System.Linq;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            var cloudPrint = new GoogleCloudPrintServices.Support.GoogleCloudPrint("basewebtek-youreontime-v1");
            cloudPrint.UserName = "doggiehostmaster@gmail.com";
            cloudPrint.Password = "kj94km6112";
            var printers = cloudPrint.Printers;
            var printer = printers.printers.First(x => x.name == "Brother HL-5450DN");
            Console.WriteLine("Ready to print!?");
            Console.ReadKey();
            var result = cloudPrint.PrintDocument(printer.id, "Toegangsticket PI 2015", File.ReadAllBytes(@"C:\Temp\Toegangsticket PI 2015.pdf"), "application/pdf"); // "text/plain");
            Console.WriteLine(string.Format("Resultaat:: {0}", result.success));
            Console.WriteLine(result.message);
            Console.ReadKey();
        }
    }
}
