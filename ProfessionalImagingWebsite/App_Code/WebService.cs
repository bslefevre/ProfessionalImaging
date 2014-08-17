using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// Summary description for WebService
/// </summary>
[WebService(Namespace = "http://localhost/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
// [System.Web.Script.Services.ScriptService]
public class WebService : System.Web.Services.WebService {
    private const string _extraThingy = "Extra text";

    public WebService () {
    }

    [WebMethod]
    public string HelloWorld() {
        return "Hello World";
    }

    [WebMethod]
    public string VertaalAllesMaar(string insertStringHere)
    {
        return insertStringHere + " hallo " + _extraThingy;
    }

    [WebMethod]
    public string AddBezoeker()
    {
        var exception = Bezoeker.Registreer("BF", "Voor", "Achter", "Email", new Profession(), 0, 1, 2, 3);
        return string.Format("EXCEPTION:: {0}; IN-TEST::", exception != null, DoggieCreationsSettings.InTest);
    }
}
