using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttendeeClassLibrary
{
    //public class Person
    //{
    //    public int anInteger = 1;
    //    public double aNumber = 3.1415;
    //    public string aString = "foo";
    //    public bool aBoolean = true;
    //    public byte[] aBuffer = new byte[10];
    //    public object[] anArray = new object[] { 1, "foo" };
    //    public object anObject = new { a = "foo", b = 12 };
    //}

    public class Startup
    {
        public static string GeefLangeId(string id)
        {
            return id.PadLeft(10, '0');
        }

        public async Task<object> Invoke(dynamic input)
        {
            //var payload = input as IDictionary<string, object>;
            return GeefLangeId((string)input.pageNumber);
        }

        public async Task<object> InsertAttendee(dynamic input)
        {
            var bedrijfsnaam = (string)input.bedrijfsnaam;
            var voorletters = (string)input.voorletters;
            var achternaam = (string)input.achternaam;
            var emailadres = (string)input.emailAdres;
            var profession = (object)input.profession; 
            var zaterdag = (int)input.zaterdag;
            var zondag = (int)input.zondag;
            var maandag = (int)input.maandag;
            var passepartout = (int)input.passepartout;



            return true;
        }
    }
}
