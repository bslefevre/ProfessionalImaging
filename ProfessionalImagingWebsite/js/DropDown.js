var background = "#FFF";
var width = 620;

$('#zaterdag').ddslick({
    data: ddData,
    width: width,
    background: background,
    imagePosition: "left",
    selectText: "Aantal zaterdag",
    onSelected: function (data) {
        $('#ZaterdagTextBox').val(data.selectedIndex);
        TotaalSom();
    }
});

$('#zondag').ddslick({
    data: ddData,
    width: width,
    background: background,
    imagePosition: "left",
    selectText: "Aantal zondag",
    onSelected: function (data) {
        $('#ZondagTextBox').val(data.selectedIndex);
        TotaalSom();
    }
});

$('#maandag').ddslick({
    data: ddData,
    width: width,
    background: background,
    imagePosition: "left",
    selectText: "Aantal maandag",
    onSelected: function (data) {
        $('#MaandagTextBox').val(data.selectedIndex);
        TotaalSom();
    }
});

$('#passepartout').ddslick({
    data: ddData,
    width: width,
    background: background,
    imagePosition: "left",
    selectText: "Aantal passe-partouts",
    onSelected: function (data) {
        $('#PassePartoutTextBox').val(data.selectedIndex);
        TotaalSom();
    }
});


function TotaalSom() {
    var ob = $('#TotaalText');

    var zaterdag = $('#zaterdag').data('ddslick').selectedData != null ? $('#zaterdag').data('ddslick').selectedData.value : 0;
    var zondag = $('#zondag').data('ddslick').selectedData != null ? $('#zondag').data('ddslick').selectedData.value : 0;
    var maandag = $('#maandag').data('ddslick').selectedData != null ? $('#maandag').data('ddslick').selectedData.value : 0;
    var passepartout = $('#passepartout').data('ddslick').selectedData != null ? $('#passepartout').data('ddslick').selectedData.value : 0;

    var totaalZaterdag = 10 * zaterdag;
    var totaalZondag = 10 * zondag;
    var totaalMaandag = 10 * maandag;
    var totaalPassepartout = 20 * passepartout;
    var totaal = totaalZaterdag + totaalZondag + totaalMaandag + totaalPassepartout;
    var count = 0;
    var text = "";
    if (totaalZaterdag > 0)
    {
        text = "Zaterdag: €" + totaalZaterdag + ",-\n";
        count++;
    }
    if (totaalZondag > 0)
    {
        text += "Zondag: €" + totaalZondag + ",-\n";
        count++;
    }
    if (totaalMaandag > 0)
    {
        text += "Maandag: €" + totaalMaandag + ",-\n";
        count++;
    }
    if (totaalPassepartout > 0)
    {
        text += "Passe-partout: €" + totaalPassepartout + ",-\n";
        count++;
    }
    if (totaal > 0)
    {
        text += "Totaal: €" + totaal + ",-";
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