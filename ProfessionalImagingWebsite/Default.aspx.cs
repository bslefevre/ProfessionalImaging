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
using Newtonsoft.Json;
using System.Collections.ObjectModel;
using Resources;

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
        RadioFieldset.Visible = false;

        if (!IsPostBack && Cache.Get(SelectedCulture) != null)
            DDL.SelectedValue = Cache.Get(SelectedCulture).ToString();
        
        var query = Request.QueryString["coupon"];
        Attendee bezoeker = null;
        if (!string.IsNullOrEmpty(query))
        {
            bezoeker = Bezoeker.HaalOp(query);
            if (bezoeker != null)
            {
                CheckBoxProfessional.Checked = bezoeker.AttendeeProfession.Professional ?? false;
                CheckBoxSemiProfessional.Checked = bezoeker.AttendeeProfession.SemiProfessional ?? false;
                CheckBoxRetail.Checked = bezoeker.AttendeeProfession.Retail ?? false;
                CheckBoxStudent.Checked = bezoeker.AttendeeProfession.Student ?? false;
                CheckBoxOverig.Checked = bezoeker.AttendeeProfession.Overig ?? false;

                Bedrijfsnaam.Text = bezoeker.Company;
                Voorletters.Text = bezoeker.Initials;
                Achternaam.Text = bezoeker.Surname;
            }
        }

        SetResources(bezoeker);
        MultiViewScreen.SetActiveView(SecondView);
    }

    private void SetResources(Attendee attendee = null)
    {
        Bedrijfsnaam.Attributes["placeholder"] = Resources.Resource.Bedrijfsnaam;
        Voorletters.Attributes["placeholder"] = Resources.Resource.Voorletters;
        Achternaam.Attributes["placeholder"] = Resources.Resource.Achternaam;
        Emailadres.Attributes["placeholder"] = Resources.Resource.Emailadres;
        RegistreerButton.Text = Resources.Resource.Registreer;
        RegistratieKnop.Text = Resources.Resource.HomeRegistreer;
        RegistreerDropDown(attendee);
    }

    public void FormOnSubmit(object sender, EventArgs e)
    {
        if (!Page.IsValid) return;

        int zaterdag = string.IsNullOrEmpty(ZaterdagTextBox.Value) ? 0 : Convert.ToInt16(ZaterdagTextBox.Value);
        int zondag = string.IsNullOrEmpty(ZondagTextBox.Value) ? 0 : Convert.ToInt16(ZondagTextBox.Value);
        int maandag = string.IsNullOrEmpty(MaandagTextBox.Value) ? 0 : Convert.ToInt16(MaandagTextBox.Value);
        int passepartout = string.IsNullOrEmpty(PassePartoutTextBox.Value) ? 0 : Convert.ToInt16(PassePartoutTextBox.Value);

        var profession = new Profession();
        profession.Professional = CheckBoxProfessional.Checked;
        profession.SemiProfessional = CheckBoxSemiProfessional.Checked;
        profession.Retail = CheckBoxRetail.Checked;
        profession.Student = CheckBoxStudent.Checked;
        profession.Overig = CheckBoxOverig.Checked;

        var bedrijfsnaam = Bedrijfsnaam.Text;
        var voorletters = Voorletters.Text;
        var achternaam = Achternaam.Text;
        var emailAdres = Emailadres.Text;
        var exception = Bezoeker.Registreer(
            bedrijfsnaam, voorletters, achternaam, emailAdres, profession, zaterdag, zondag, maandag, passepartout);
        if (exception != null)
        {
            ShowMessage(MessageType.Error, exception.Message);
        }
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
    }

    private void ShowMessage(string messageType, string message)
    {
        MessageDiv.InnerHtml = message;
        MessageDiv.Attributes["class"] = string.Format("message {0}", messageType);
        ClientScript.RegisterClientScriptBlock(this.GetType(), "Sleutel", "showMessageTrigger();", true);
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
        ClientScript.RegisterClientScriptBlock(this.GetType(), "Reload", "location.reload()", true);
    }

    public void RegistreerDropDown(Attendee attendee = null)
    {
        var zaterdagDropdown = CreateDropDownData(attendee != null ? attendee.Zaterdag : (int?)null);
        var zondagDropdown = CreateDropDownData(attendee != null ? attendee.Zondag : (int?)null);
        var maandagDropdown = CreateDropDownData(attendee != null ? attendee.Maandag : (int?)null);
        var passePartoutDropdown = CreateDropDownData(attendee != null ? attendee.PassePartout : (int?)null);


        var dagen = string.Format("var zaterdag = '{0}'; var zondag = '{1}'; var maandag = '{2}'; var passePartouts = '{3}'; var aantal = '{4}'; var totaal = '{5}';"
            , Resource.Zaterdag, Resource.Zondag, Resource.Maandag, Resource.PassePartouts, Resource.Aantal, Resource.Totaal);

        var data = string.Format("{0} var ddDataZaterdag = {1}; var ddDataZondag = {2}; var ddDataMaandag = {3}; var ddDataPassePartout = {4}; "
            , dagen, zaterdagDropdown, zondagDropdown, maandagDropdown, passePartoutDropdown);

        ClientScript.RegisterClientScriptBlock(this.GetType(), "DropDown", data, true);
    }

    protected string CreateDropDownData(int? selectedValue = null)
    {
        var dropDownCollection = new Collection<DropDown>();
        dropDownCollection.Add(new DropDown { Text = "0", Value = 0, Selected = false, Description = Resource.XKaarten.Formatteer("0") });
        dropDownCollection.Add(new DropDown { Text = "1", Value = 1, Selected = false, Description = Resource.XKaart.Formatteer("1") });
        dropDownCollection.Add(new DropDown { Text = "2", Value = 2, Selected = false, Description = Resource.XKaarten.Formatteer("2") });
        dropDownCollection.Add(new DropDown { Text = "3", Value = 3, Selected = false, Description = Resource.XKaarten.Formatteer("3") });
        dropDownCollection.Add(new DropDown { Text = "4", Value = 4, Selected = false, Description = Resource.XKaarten.Formatteer("4") });
        dropDownCollection.Add(new DropDown { Text = "5", Value = 5, Selected = false, Description = Resource.XKaarten.Formatteer("5") });
        dropDownCollection.Add(new DropDown { Text = "6", Value = 6, Selected = false, Description = Resource.XKaarten.Formatteer("6") });
        dropDownCollection.Add(new DropDown { Text = "7", Value = 7, Selected = false, Description = Resource.XKaarten.Formatteer("7") });
        dropDownCollection.Add(new DropDown { Text = "8", Value = 8, Selected = false, Description = Resource.XKaarten.Formatteer("8") });
        dropDownCollection.Add(new DropDown { Text = "9", Value = 9, Selected = false, Description = Resource.XKaarten.Formatteer("9") });

        if (selectedValue.HasValue)
            dropDownCollection.FirstOrDefault(x => x.Value == selectedValue.Value).Selected = true;

        return JsonConvert.SerializeObject(dropDownCollection, Formatting.None);
    }
    
    protected void PersoonsInformatie_ServerValidate(object source, ServerValidateEventArgs args)
    {
        CustomValidator cv = source as CustomValidator;
        var textBox = SecondView.Controls.OfType<TextBox>().FirstOrDefault(x => x.ID == cv.ControlToValidate);
        var label = textBox.Attributes["placeholder"];
        args.IsValid = !string.IsNullOrEmpty(textBox.Text);
        var errorMessage = string.Format("{0} is verplicht.", label);
        cv.ErrorMessage = errorMessage;
        cv.Text = errorMessage;
    }
}

public class DropDown
{
    [JsonProperty("text")]
    public string Text { get; set; }
    [JsonProperty("value")]
    public int Value { get; set; }
    [JsonProperty("selected")]
    public bool Selected { get; set; }
    [JsonProperty("description")]
    public string Description { get; set; }
    [JsonProperty("imageSrc")]
    public string ImageSrc { get; set; }
}