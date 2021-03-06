﻿using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Bezoekers : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            BindGrid();
        }
    }

    public void BindGrid()
    {
        using (var obj = new ProfessionalImagingEntity())
        {
            BezoekersGridView.DataSource = obj.Attendee.ToList();
            BezoekersGridView.DataBind();
        }
    }

    protected void BezoekersGridView_RowEditing(object sender, GridViewEditEventArgs e)
    {
        var gridView = sender as GridView;
        if (gridView == null) return;
        gridView.EditIndex = e.NewEditIndex;
        BindGrid();
    }

    protected void BezoekersGridView_RowUpdating(object sender, GridViewUpdateEventArgs e)
    {
        var gridView = sender as GridView;
        if (gridView == null) return;
        var row = gridView.Rows[e.RowIndex];
        var idCell = row.Cells.Cast<DataControlFieldCell>().ToList().FirstOrDefault(x =>
        {
            var c = x.ContainingField as AutoGeneratedField;
            if (c != null && c.DataField == "Id")
                return true;
            return false;
        });

        var newV = e.NewValues.Cast<DictionaryEntry>();

        using (var obj = new ProfessionalImagingEntity())
        {
            Attendee attendee = obj.Attendee.Find((Convert.ToInt32(idCell.Text)));
            foreach (var dictionaryEntry in newV)
            {
                if (dictionaryEntry.Key == null) continue;

                var key = dictionaryEntry.Key.ToString();
                if (key == "Id")
                {
                    attendee = obj.Attendee.Find((Convert.ToInt32(dictionaryEntry.Value)));
                    continue;
                }

                var pi = typeof(Attendee).GetProperty(key);
                if (attendee == null) continue;
                object value = null;
                var targetType = IsNullableType(pi.PropertyType) ? Nullable.GetUnderlyingType(pi.PropertyType) : pi.PropertyType;
                try
                {
                    value = Convert.ChangeType(dictionaryEntry.Value, targetType);
                }
                catch (InvalidCastException)
                {
                    return;
                }
                pi.SetValue(attendee, value, null);
            }

            obj.SaveChanges();
        }

        gridView.EditIndex = -1;
        BindGrid();
    }

    private static bool IsNullableType(Type type)
    {
        return type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>));
    }

    protected void BezoekersGridView_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
    {
        var gridView = sender as GridView;
        if (gridView == null) return;
        gridView.EditIndex = -1;
        BindGrid();
    }

    protected void BezoekersGridView_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        var id = e.CommandArgument;
        switch (e.CommandName)
        {
            case "GenereerCoupon":
                using (var obj = new ProfessionalImagingEntity())
                {
                    var attendee = obj.Attendee.Find(Convert.ToInt32(id));
                    if (attendee == null) return;
                    var coupon = Crypto.Encrypt(Bezoeker.GeefLangeId(id.ToString()));

                    ClientScript.RegisterClientScriptBlock(this.GetType(), "Alert", string.Format("alert('{0}');", coupon), true);
                }
                break;
            case "GenereerPdf":
                var image = Barcode.Create(Bezoeker.GeefLangeId(id.ToString()));
                //Pdf.Generate(Bezoeker.GeefLangeId(id.ToString()));
                if (image == null) return;
                using (var obj = new ProfessionalImagingEntity())
                {
                    var attendee = obj.Attendee.Find(Convert.ToInt32(id));
                    if (attendee == null) return;
                    attendee.Barcode = image;
                    obj.SaveChanges();
                }
                break;
            case "SendMail":
                using (var obj = new ProfessionalImagingEntity())
                {
                    var attendee = obj.Attendee.Find(Convert.ToInt32(id));
                    if (attendee == null) return;
                    Email.Create(attendee);
                }
                break;
        }

        BindGrid();
    }

    public string GetImage(object img)
    {
        if (img == null) return string.Empty;
        return "data:image/jpg;base64," + Convert.ToBase64String((byte[])img);
    }
}