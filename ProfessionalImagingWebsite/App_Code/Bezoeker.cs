using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Data.Entity;

public static class Bezoeker
{
    public static Exception Registreer(string bedrijfsnaam, string voorletters, string achternaam, string emailAdres, Profession profession, int zaterdag, int zondag, int maandag, int passepartout)
    {
        if (DoggieCreationsSettings.InTest) return null;
        var attendee = new Attendee
        {
            Contract = DoggieCreationsSettings.CompanyName,
            Company = bedrijfsnaam,
            Initials = voorletters,
            Surname = achternaam,
            Emailaddress = emailAdres,
            AttendeeProfession = profession,
            Zaterdag = zaterdag,
            Zondag = zondag,
            Maandag = maandag,
            PassePartout = passepartout
        };
        
        using (var obj = new ProfessionalImagingEntity())
        {
            obj.Attendee.Add(attendee);
            try
            {
                obj.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                var entityValidationError = e.EntityValidationErrors.FirstOrDefault();
                var message = string.Empty;
                foreach(var validationError in entityValidationError.ValidationErrors)
                {
                    message += string.Format("{0}{1}", validationError.ErrorMessage, Environment.NewLine);
                }
                return new Exception(message);
            }
        }

        return null;
    }

    public static Attendee HaalOp(int id)
    {
        using (var obj = new ProfessionalImagingEntity())
        {
            return obj.Attendee.Include(x => x.AttendeeProfession).FirstOrDefault(x => x.Id == id);
        }
    }

    public static Attendee HaalOp(string message)
    {
        var message2 = HttpUtility.UrlEncode(message);

        var result = Crypto.Decrypt(message);
        var id = Convert.ToInt32(result);

        return HaalOp(id);
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