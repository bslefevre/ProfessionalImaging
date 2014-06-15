var background = "#FFF";
var width = 620;

$('#zaterdag').ddslick({
    data: ddDataZaterdag,
    width: width,
    background: background,
    imagePosition: "left",
    selectText: aantal + ' ' + zaterdag,
    onSelected: function (data) {
        $('#ZaterdagTextBox').val(data.selectedIndex);
        TotaalSom();
    }
});

$('#zondag').ddslick({
    data: ddDataZondag,
    width: width,
    background: background,
    imagePosition: "left",
    selectText: aantal + ' ' + zondag,
    onSelected: function (data) {
        $('#ZondagTextBox').val(data.selectedIndex);
        TotaalSom();
    }
});

$('#maandag').ddslick({
    data: ddDataMaandag,
    width: width,
    background: background,
    imagePosition: "left",
    selectText: aantal + ' ' + maandag,
    onSelected: function (data) {
        $('#MaandagTextBox').val(data.selectedIndex);
        TotaalSom();
    }
});

$('#passepartout').ddslick({
    data: ddDataPassePartout,
    width: width,
    background: background,
    imagePosition: "left",
    selectText: aantal + ' ' + passePartouts,
    onSelected: function (data) {
        $('#PassePartoutTextBox').val(data.selectedIndex);
        TotaalSom();
    }
});


function TotaalSom() {
    var ob = $('#TotaalText');

    var zaterdagValue = GetSelectedValue('#zaterdag');
    var zondagValue = GetSelectedValue('#zondag');
    var maandagValue = GetSelectedValue('#maandag');
    var passepartoutValue = GetSelectedValue('#passepartout');

    var totaalZaterdag = 10 * zaterdagValue;
    var totaalZondag = 10 * zondagValue;
    var totaalMaandag = 10 * maandagValue;
    var totaalPassepartout = 20 * passepartoutValue;
    var totaalSamen = totaalZaterdag + totaalZondag + totaalMaandag + totaalPassepartout;
    var count = 0;
    var text = "";
    if (totaalZaterdag > 0)
    {
        text = Capitalize(zaterdag) + ": €" + totaalZaterdag + ",-\n";
        count++;
    }
    if (totaalZondag > 0)
    {
        text += Capitalize(zondag) + ": €" + totaalZondag + ",-\n";
        count++;
    }
    if (totaalMaandag > 0)
    {
        text += Capitalize(maandag) + ": €" + totaalMaandag + ",-\n";
        count++;
    }
    if (totaalPassepartout > 0)
    {
        text += Capitalize(passePartouts) + ": €" + totaalPassepartout + ",-\n";
        count++;
    }
    if (totaalSamen > 0)
    {
        text += Capitalize(totaal) + ": €" + totaalSamen + ",-";
        count++;
    }

    if (count == 0)
    {
        $('#TotaalText').css("display", "none");
        $('#TotaalText').attr("rows", 1);
    } else {
        $('#TotaalText').css("display", "inherit");
        $('#TotaalText').attr("rows", count);
    }
    
    $('#TotaalText').val(text);
}

function Capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

function GetSelectedValue(id){
    return $(id).data('ddslick') != null ? $(id).data('ddslick').selectedData != null ? $(id).data('ddslick').selectedData.value : 0 : 0;
}