using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public static class Bezoeker
{
    public static Exception Registreer(int professie, string bedrijfsnaam, string voorletters, string achternaam, string emailAdres)
    {
        if (DoggieCreationsSettings.InTest) return null;
        var attendee = new Attendee { Contract = DoggieCreationsSettings.CompanyName, Company = bedrijfsnaam, Profession = professie, Initials = voorletters, Surname = achternaam, Emailaddress = emailAdres };

        using (var obj = new ProfessionalImagingEntity())
        {
            obj.Attendee.Add(attendee);
            try
            {
                obj.SaveChanges();
            }
            catch (Exception e)
            {
                return e;
            }
        }

        return null;
    }

    public static Attendee HaalOp(int id)
    {
        using (var obj = new ProfessionalImagingEntity())
        {
            return obj.Attendee.Find(id);
        }
    }

    public static Attendee HaalOp(string message)
    {
        var json = Crypto.DecryptString(message, DoggieCreationsSettings.PassWord);
        
        var result = JsonConvert.DeserializeObject<Attendee>(json);

        return HaalOp(result.Id);
    }

    public static string GeefLangeId(string id)
    {
        return id.PadLeft(10, '0');
    }

    public static byte[] GeefBarcode(int id , byte[] barcode)
    {
        if (barcode == null || barcode.Length == 0)
        {
            return Barcode.Create(GeefLangeId(id.ToString()));
        }
        return barcode;
    }
}