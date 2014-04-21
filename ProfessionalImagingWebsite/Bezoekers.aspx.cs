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
            BindGrid();
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

        var keys = e.Keys;
        var oldV = e.OldValues;
        var newV = e.NewValues.Cast<DictionaryEntry>();

        using (var obj = new ProfessionalImagingEntity())
        {
            Attendee attendee = null;
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
                pi.SetValue(attendee, dictionaryEntry.Value, new object[] { });
            }

            obj.SaveChanges();
        }

        gridView.EditIndex = -1;
        BindGrid();
    }

    protected void BezoekersGridView_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
    {
        var gridView = sender as GridView;
        if (gridView == null) return;
        gridView.EditIndex = -1;
        BindGrid();
    } 
}