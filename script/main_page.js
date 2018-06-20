function MainPageView()
{}

MainPageView.render = function ()
{
    $.ajax(
            {
                url: "resources/desc.md",
                success: function (result)
                {
                    var mdConverter = new showdown.Converter();
                    var html = mdConverter.makeHtml(result);
                    html = filterXSS(html);

                    $("#content").html("<div id='desc'>" + html + "</div>");
                }
            });
};

MainPageView.genClick = function ()
{
    var value = $("#search_area").val();

    if (value.match(/^[a-z][a-z0-9-.]+[a-z0-9]\/[a-z][a-z0-9-]+[a-z0-9]$/) === null)
    {
        $("#popup_dailog--content").html("<p>Введен неверный формат ссылки на пост!</p>"
                + "<p>Ссылка должна иметь вид: </p> "
                + "<p style='font-weight: bold;'>author/permlink</p>");
        $("#popup_dailog").show();
        return;
    }

    var value = value.split("/");

    var author = value[0];
    var permlink = value[1];

    golos.api.getContent(author, permlink, 0, function (err, result)
    {
        if (!err)
        {
            console.log(result);

            if (result.id !== 0)
            {
                var golosio;
                var golosblog;
                var goldvoice;

                if ($("#check_golosio").attr("checked"))
                    golosio = "https://golos.io" + result.url + "\n\n";

                if ($("#check_golosblog").attr("checked"))
                    golosblog = "https://golos.blog" + result.url + "\n\n";

                if ($("#check_goldvoice").attr("checked"))
                    goldvoice = "https://goldvoice.club/@" + author + "/" + permlink;

                $("#content").html(
                        "<textarea id='links-area'>"
                        + golosio
                        + golosblog
                        + goldvoice
                        + "</textarea>"
                        + "<button id='copy_button' "
                        + "data-clipboard-action='copy' data-clipboard-target='#links-area'"
                        + " >"
                        + "Копировать"
                        + "</button>");
                
                new ClipboardJS('#copy_button');
                
//                onclick='MainPageView.copyClick()'
            } else
            {
                $("#popup_dailog--content").html("<p>Пост не найден!</p>");
                $("#popup_dailog").show();
            }
        } else
            console.log(err);
    });
};

MainPageView.popButClick = function ()
{
    $("#popup_dailog").hide();
};