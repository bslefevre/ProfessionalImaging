using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;

namespace ConsoleApplication1
{
    public class GoogleCloudPrint
    {
        public GoogleCloudPrint()
        {
            Source = "basewebtek-youreontime-v1";
        }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string Source { get; set; }

        public CloudPrintJob PrintDocument(string printerId, string title, byte[] document)
        {
            try
            {
                string authCode;
                if (!Authorize(out authCode))
                    return new CloudPrintJob() { success = false };

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://www.google.com/cloudprint/submit?output=json");
                request.Method = "POST";

                string queryString =
                    "printerid=" + HttpUtility.UrlEncode(printerId) +
                    "&capabilities=" + HttpUtility.UrlEncode("") +
                    "&contentType=" + HttpUtility.UrlEncode("application/pdf") +
                    "&title=" + HttpUtility.UrlEncode(title) +
                    "&content=" + HttpUtility.UrlEncode(Convert.ToBase64String(document));

                byte[] data = new ASCIIEncoding().GetBytes(queryString);

                request.Headers.Add("X-CloudPrint-Proxy", Source);
                request.Headers.Add("Authorization", "GoogleLogin auth=" + authCode);

                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = data.Length;

                Stream stream = request.GetRequestStream();
                stream.Write(data, 0, data.Length);
                stream.Close();

                // Get response
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                string responseContent = new StreamReader(response.GetResponseStream()).ReadToEnd();

                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(CloudPrintJob));
                MemoryStream ms = new MemoryStream(Encoding.Unicode.GetBytes(responseContent));
                CloudPrintJob printJob = serializer.ReadObject(ms) as CloudPrintJob;

                return printJob;
            }
            catch (Exception ex)
            {
                return new CloudPrintJob() { success = false, message = ex.Message };
            }
        }

        public CloudPrinters Printers
        {
            get
            {
                var printers = new CloudPrinters();

                string authCode;
                if (!Authorize(out authCode))
                    return new CloudPrinters() { success = false };

                try
                {
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://www.google.com/cloudprint/search?output=json");
                    request.Method = "POST";

                    request.Headers.Add("X-CloudPrint-Proxy", Source);
                    request.Headers.Add("Authorization", "GoogleLogin auth=" + authCode);

                    request.ContentType = "application/x-www-form-urlencoded";
                    request.ContentLength = 0;

                    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                    string responseContent = new StreamReader(response.GetResponseStream()).ReadToEnd();

                    DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(CloudPrinters));
                    MemoryStream ms = new MemoryStream(Encoding.Unicode.GetBytes(responseContent));
                    printers = serializer.ReadObject(ms) as CloudPrinters;

                    return printers;
                }
                catch (Exception)
                {
                    return printers;
                }
            }
        }

        private bool Authorize(out string authCode)
        {
            bool result = false;
            authCode = "";

            string queryString = String.Format("https://www.google.com/accounts/ClientLogin?accountType=HOSTED_OR_GOOGLE&Email={0}&Passwd={1}&service=cloudprint&source={2}", UserName, Password, Source);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(queryString);

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            string responseContent = new StreamReader(response.GetResponseStream()).ReadToEnd();

            string[] split = responseContent.Split('\n');
            foreach (string s in split)
            {
                string[] nvsplit = s.Split('=');
                if (nvsplit.Length == 2)
                {
                    if (nvsplit[0] == "Auth")
                    {
                        authCode = nvsplit[1];
                        result = true;
                    }
                }
            }

            return result;
        }
    }

    [DataContract]
    public class CloudPrintJob
    {
        [DataMember]
        public bool success { get; set; }

        [DataMember]
        public string message { get; set; }
    }

    [DataContract]
    public class CloudPrinters
    {
        [DataMember]
        public bool success { get; set; }

        [DataMember]
        public List<CloudPrinter> printers { get; set; }
    }

    [DataContract]
    public class CloudPrinter
    {
        [DataMember]
        public string id { get; set; }

        [DataMember]
        public string name { get; set; }

        [DataMember]
        public string description { get; set; }

        [DataMember]
        public string proxy { get; set; }

        [DataMember]
        public string status { get; set; }

        [DataMember]
        public string capsHash { get; set; }

        [DataMember]
        public string createTime { get; set; }

        [DataMember]
        public string updateTime { get; set; }

        [DataMember]
        public string accessTime { get; set; }

        [DataMember]
        public bool confirmed { get; set; }

        [DataMember]
        public int numberOfDocuments { get; set; }

        [DataMember]
        public int numberOfPages { get; set; }
    }
}

namespace ConsoleApplication1
{
    [TestClass]
    public class TestClass
    {
        [TestMethod]
        public void TestGetPrinters()
        {
            var cloudPrint = new GoogleCloudPrint();
            cloudPrint.UserName = "doggiehostmaster@gmail.com";
            cloudPrint.Password = "kj94km6112";
            var printers = cloudPrint.Printers;
            var printer = printers.printers.First(x => x.name == "Save to Google Docs");
        }

        [TestMethod]
        public void TestSendPrintJob()
        {
            var cloudPrint = new GoogleCloudPrint();
            cloudPrint.UserName = "doggiehostmaster@gmail.com";
            cloudPrint.Password = "kj94km6112";
            var printer = cloudPrint.Printers.printers.First(x => x.name == "Save to Google Docs");
            cloudPrint.PrintDocument(printer.id, "Test", File.ReadAllBytes(@"C:\Temp\Toegangsticket PI 2015.pdf"));
        }
    }
}