﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<link href="StyleSheet.css" rel="stylesheet" />
<script src="js/jquery.min.js"></script>
<script src="js/Notification.js"></script>
<head runat="server">
    <title></title>
</head>
<body>
    <div runat="server" id="MessageDiv" class="success message"></div>
    <div class="toTheCenter">
        <form id="form1" runat="server">
            <asp:HiddenField runat="server" ID="SuccessMessage" Value="<h3>U bent geregistreerd!</h3><p>Welkom {aanroep} {voorletters} {achternaam}.</p>" />
            <asp:HiddenField runat="server" ID="WarningMessage" Value="<h3>E-mail verkeerd</h3><p>Bijna.. Bijna..!</p>" />
            <asp:HiddenField runat="server" ID="ErrorMessage" Value="<h3>E-mail verkeerd</h3><p>Bijna.. Bijna..!</p>" />
            <asp:HiddenField runat="server" ID="InformationMesage" Value="<h3>E-mail verkeerd</h3><p>Bijna.. Bijna..!</p>" />
            <asp:MultiView ID="MultiViewScreen" runat="server" ActiveViewIndex="0" ViewStateMode="Disabled">
                <asp:View runat="server">
                    <div>
                        <asp:LinkButton ID="RegistratieKnop" CssClass="superLarge button pink" runat="server" CommandName="NextView" />
                    </div>
                </asp:View>
                <asp:View ID="SecondView" runat="server" OnDeactivate="SecondView_Deactivate">
                    <div>
                        <fieldset class="checkboxes">
                            <label class="label_check" for="CheckBoxProfessional">
                                <asp:CheckBox ID="CheckBoxProfessional" runat="server" /><%= (string)GetGlobalResourceObject("Resource", "Professioneel") %></label>
                            <label class="label_check" for="CheckBoxSemiProfessional">
                                <asp:CheckBox ID="CheckBoxSemiProfessional" runat="server" /><%= (string)GetGlobalResourceObject("Resource", "SemiProfessioneel") %></label>
                            <label class="label_check" for="CheckBoxRetail">
                                <asp:CheckBox ID="CheckBoxRetail" runat="server" /><%= (string)GetGlobalResourceObject("Resource", "Retail") %></label>
                            <label class="label_check" for="CheckBoxStudent">
                                <asp:CheckBox ID="CheckBoxStudent" runat="server" /><%= (string)GetGlobalResourceObject("Resource", "Student") %></label>
                            <label class="label_check" for="CheckBoxOverig">
                                <asp:CheckBox ID="CheckBoxOverig" runat="server" /><%= (string)GetGlobalResourceObject("Resource", "Overig") %></label>
                        </fieldset>
                        <fieldset class="radios" runat="server" id="RadioFieldset">
                            <label runat="server" id="Label1" class="label_radio" for="Radio01">
                                <asp:RadioButton runat="server" ID="Radio01" Checked="true" GroupName="Gender" /><%= (string)GetGlobalResourceObject("Resource", "Man") %>
                            </label>
                            <label runat="server" id="Label2" class="label_radio" for="Radio02">
                                <asp:RadioButton runat="server" ID="Radio02" GroupName="Gender" /><%= (string)GetGlobalResourceObject("Resource", "Vrouw") %>
                            </label>
                        </fieldset>
                        <div id="zaterdag" runat="server"></div>
                        <div id="zondag"></div>
                        <div id="maandag"></div>
                        <div id="passepartout"></div>
                        <asp:HiddenField ID="ZaterdagTextBox" runat="server" />
                        <asp:HiddenField ID="ZondagTextBox" runat="server" />
                        <asp:HiddenField ID="MaandagTextBox" runat="server" />
                        <asp:HiddenField ID="PassePartoutTextBox" runat="server" />
                        <asp:TextBox CssClass="TestClass" ID="Bedrijfsnaam" runat="server" autocomplete="off" /><br />
                        <asp:CustomValidator CssClass="ErrorText" runat="server" ControlToValidate="Voorletters" OnServerValidate="PersoonsInformatie_ServerValidate" Display="Dynamic" ValidateEmptyText="true" />
                        <asp:TextBox CssClass="TestClass" ID="Voorletters" runat="server" autocomplete="off" /><br />
                        <asp:CustomValidator CssClass="ErrorText" runat="server" ControlToValidate="Achternaam" OnServerValidate="PersoonsInformatie_ServerValidate" Display="Dynamic" ValidateEmptyText="true" />
                        <asp:TextBox CssClass="TestClass" ID="Achternaam" runat="server" autocomplete="off" /><br />
                        <asp:CustomValidator CssClass="ErrorText" runat="server" OnServerValidate="Email_ServerValidate" ControlToValidate="Emailadres" Display="Dynamic" />
                        <asp:TextBox CssClass="TestClass" ID="Emailadres" runat="server" autocomplete="off" /><br />
                        <asp:TextBox Rows="1" ID="TotaalText" style="resize:none; background-color:white; display:none" runat="server" TextMode="MultiLine" CssClass="TestClass" Enabled="false" ReadOnly="true" />
                        <asp:Button type="submit" ID="RegistreerButton" runat="server" OnClick="FormOnSubmit" CommandName="PrevView" CssClass="button super" CausesValidation="true" />
                    </div>
                </asp:View>
            </asp:MultiView>
            <asp:DropDownList AutoPostBack="true" CssClass="BottomLeft" runat="server" ID="DDL" OnSelectedIndexChanged="DDL_SelectedIndexChanged">
                <asp:ListItem Value="nl-NL" Text="NL" />
                <asp:ListItem Value="de-DE" Text="DE" />
                <asp:ListItem Value="en-US" Text="EN" />
            </asp:DropDownList>
        </form>
    </div>

    <script src="js/RadioAndCheckButton.js"></script>
    <script type="text/javascript" src="js/jquery.ddslick.min.js"></script>
    <script src="js/DropDown.js"></script>
</body>
</html>