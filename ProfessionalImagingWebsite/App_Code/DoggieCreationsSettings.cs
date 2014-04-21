using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for DoggieCreationsSettings
/// </summary>
public class DoggieCreationsSettings
{
    public static string CompanyName { get { return ConfigurationManager.AppSettings["companyName"].ToString(); } }

    public static string PassWord { get { return ConfigurationManager.AppSettings["passWord"].ToString(); } }

    public static bool InTest { get { return Convert.ToBoolean(ConfigurationManager.AppSettings["inTest"]); } }
}