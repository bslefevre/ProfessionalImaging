<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Bezoekers.aspx.cs" Inherits="Bezoekers" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:GridView runat="server" ID="BezoekersGridView" AutoGenerateColumns="True" AutoGenerateEditButton="true"
                OnRowEditing="BezoekersGridView_RowEditing"
                OnRowUpdating="BezoekersGridView_RowUpdating"
                OnRowCancelingEdit="BezoekersGridView_RowCancelingEdit"
                DataKeyNames="Id,Contract"
                OnRowCommand="BezoekersGridView_RowCommand">
                <Columns>
                    <asp:TemplateField>
                        <ItemTemplate>
                            <asp:LinkButton Text="Mail" ID="SendMail" runat="server" CommandName="SendMail" CommandArgument='<%# Bind("Id") %>' />
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField>
                        <ItemTemplate>
                            <asp:LinkButton ID="GenereerCouponLinkButton" CommandName="GenereerCoupon" CommandArgument='<%# Bind("Id") %>' Text="Genereer coupon" runat="server" />
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField>
                        <ItemTemplate>
                            <asp:LinkButton ID="GenereerPdfLinkButton" CommandName="GenereerPdf" CommandArgument='<%# Bind("Id") %>' Text="Genereer PDF" runat="server" />
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField>
                        <ItemTemplate>
                            <asp:Image runat="server" ImageUrl='<%# GetImage(Eval("Barcode")) %>' />
                        </ItemTemplate>
                    </asp:TemplateField>
                    <%--<asp:TemplateField>
                        <ItemTemplate>
                            <asp:LinkButton Text="Edit" runat="server" CommandName="Edit" />
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:LinkButton Text="Save" runat="server" CommandName="Update" />
                            <asp:LinkButton Text="Cancel" runat="server" CommandName="Cancel" />
                        </EditItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Id">
                        <ItemTemplate>
                            <asp:Label ID="lblId" runat="server" Text='<%# Bind("Id") %>' />
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:Label ID="lblId" runat="server" Text='<%# Bind("Id") %>' />
                        </EditItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Bedrijfsnaam">
                        <ItemTemplate>
                            <asp:Label ID="lblCompany" runat="server" Text='<%# Bind("Company") %>' />
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:TextBox ID="txtBoxCompany" runat="server" Text='<%# Bind("Company") %>' />
                        </EditItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Voorletters">
                        <ItemTemplate>
                            <asp:Label ID="lblInitials" runat="server" Text='<%# Bind("Initials") %>' />
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:TextBox ID="txtBoxInitials" runat="server" Text='<%# Bind("Initials") %>' />
                        </EditItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Achternaam">
                        <ItemTemplate>
                            <asp:Label ID="lblSurname" runat="server" Text='<%# Bind("Surname") %>' />
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:TextBox ID="txtBoxSurname" runat="server" Text='<%# Bind("Surname") %>' />
                        </EditItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="E-mailadres">
                        <ItemTemplate>
                            <asp:Label ID="lblEmailAddress" runat="server" Text='<%# Bind("Emailaddress") %>' />
                        </ItemTemplate>
                        <EditItemTemplate>
                            <asp:TextBox ID="txtBoxEmailAdress" runat="server" Text='<%# Bind("Emailaddress") %>' />
                        </EditItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Betaald?">
                        <ItemTemplate>
                            <asp:CheckBox ID="chkBoxHasPaid" runat="server" Checked='<%# Bind("HasPaid") %>' Enabled="false" />
                        </ItemTemplate>
                    </asp:TemplateField>

                    <asp:TemplateField HeaderText="Genereer coupon"></asp:TemplateField>--%>
                </Columns>
            </asp:GridView>
        </div>
    </form>
</body>
</html>
