using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using DoggieCreationsFramework;
using System.Globalization;
using System.Threading;
using System.Web.Caching;
using System.Security.Cryptography;

public partial class _Default : System.Web.UI.Page
{
    public const string SelectedCulture = "SelectedCulture";

    private CultureInfo UserChoosenCulture
    {
        get { return Cache.Get(SelectedCulture) != null ? new CultureInfo(Cache.Get(SelectedCulture).ToString()) : null; }
    }

    protected override void InitializeCulture()
    {
        base.InitializeCulture();
        if (UserChoosenCulture == null) return;
        Thread.CurrentThread.CurrentUICulture = UserChoosenCulture;
        Thread.CurrentThread.CurrentCulture = UserChoosenCulture;
    }

    public void RemoveCouponFromUrlAndReload()
    {
        var nvc = HttpUtility.ParseQueryString(Request.Url.Query);
        nvc.Remove("coupon");

        string url = Request.Url.AbsolutePath;
        if (nvc.ToString() != string.Empty)
            url += "?" + nvc.ToString();

        Response.Redirect(url);
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        var query = Request.QueryString["coupon"];
        if (!string.IsNullOrEmpty(query))
        {
            var bezoeker = Bezoeker.HaalOp(query);
            if (bezoeker != null)
            {
                Bedrijfsnaam.Text = bezoeker.Company;
                Voorletters.Text = bezoeker.Initials;
                Achternaam.Text = bezoeker.Surname;
            }
        }
        //ShowMessage(MessageType.Warning, Crypto.DecryptString(query, "PI2015"));

        //var json = "{\"id\":\"0\"}";

        RadioFieldset.Visible = false;

        if (!IsPostBack && Cache.Get(SelectedCulture) != null)
            DDL.SelectedValue = Cache.Get(SelectedCulture).ToString();

        SetResources();
    }

    private void SetResources()
    {
        Bedrijfsnaam.Attributes["placeholder"] = Resources.Resource.Bedrijfsnaam;
        Voorletters.Attributes["placeholder"] = Resources.Resource.Voorletters;
        Achternaam.Attributes["placeholder"] = Resources.Resource.Achternaam;
        Emailadres.Attributes["placeholder"] = Resources.Resource.Emailadres;
        RegistreerButton.Text = Resources.Resource.Registreer;
        RegistratieKnop.Text = Resources.Resource.HomeRegistreer;
    }

    public void FormOnSubmit(object sender, EventArgs e)
    {
        var bedrijfsnaam = Bedrijfsnaam.Text;
        var voorletters = Voorletters.Text;
        var achternaam = Achternaam.Text;
        var emailAdres = Emailadres.Text;
        var exception = Bezoeker.Registreer(1, bedrijfsnaam, voorletters, achternaam, emailAdres);
        if (exception != null)
            ShowMessage(MessageType.Error, exception.Message);
        else
        {
            var message = Resources.Resource.SuccessMessage.Formatteer(() => new[] { voorletters, achternaam });
            ShowMessage(MessageType.Success, message);
        }
    }
    protected void SecondView_Deactivate(object sender, EventArgs e)
    {
        var multiView = sender as View;
        if (!Page.IsValid)
        {
            MultiViewScreen.SetActiveView(multiView);
            return;
        }

        //Reset controls
        var controlCollection = multiView.Controls;
        foreach (Control control in controlCollection)
        {
            if (control is TextBox)
                ((TextBox)control).Text = string.Empty;
        }

        DDL.SelectedIndex = 0;
        DDL_SelectedIndexChanged(DDL, new EventArgs());
    }

    public bool IsMailAdresValid(string emailaddress)
    {
        try
        {
            MailAddress m = new MailAddress(emailaddress);
            return true;
        }
        catch (FormatException)
        {
            return false;
        }
    }
    protected void Email_ServerValidate(object source, ServerValidateEventArgs args)
    {
        var email = args.Value;
        args.IsValid = IsMailAdresValid(email);
        CustomValidator cv = source as CustomValidator;
        cv.ErrorMessage = args.IsValid ? string.Empty : "E-mailadres is niet juist";
        cv.Text = args.IsValid ? string.Empty : "E-mailadres is niet juist";

        ShowMessage(MessageType.Warning);
    }

    private void ShowMessage(string messageType, string message)
    {
        MessageDiv.InnerHtml = message;
        MessageDiv.Attributes["class"] = string.Format("message {0}", messageType);

        ClientScript.RegisterClientScriptBlock(this.GetType(), "Sleutel", "showMessageTrigger()", true);
    }

    private void ShowMessage(string messageType)
    {
        var message = string.Empty;
        switch (messageType)
        {
            case MessageType.Success:
                message = SuccessMessage.Value;
                break;
            case MessageType.Warning:
                message = WarningMessage.Value;
                break;
            case MessageType.Error:
                message = ErrorMessage.Value;
                break;
            case MessageType.Information:
                message = InformationMesage.Value;
                break;
        }

        ShowMessage(messageType, message);
    }
    public static class MessageType
    {
        public const string Success = "success";
        public const string Warning = "warning";
        public const string Error = "error";
        public const string Information = "information";
    }
    protected void DDL_SelectedIndexChanged(object sender, EventArgs e)
    {
        var ddl = sender as DropDownList;
        if (ddl == null) return;

        if (Cache.Get(SelectedCulture) != null)
            Cache.Remove(SelectedCulture);
        Cache.Insert(SelectedCulture, ddl.SelectedValue);

        InitializeCulture();
        SetResources();
    }
}