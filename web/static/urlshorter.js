

function cleanInput() {
    $('#url').val('');
}

function submitToAPI() {
    var shorterUrl = "https://59sy703n1f.execute-api.ap-northeast-2.amazonaws.com/Prod/";

    var urlTester = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    if (!urlTester.test($("#url").val())) {
        message('please put the right url');
        return;
    }

    var url = $("#url").val();
    
    var data = {
        url: url
    };

    $.ajax({
        type: "POST",
        url: shorterUrl,
        dataType: "json",
        crossDomain: "true",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        beforeSend: function () {
            message('loading');
        },
        success: function (data) {
            message('<b>ShortUrl: </b><span>' + shorterUrl + data.shortId + '</span>')
        },
        error: function () {
            message('oops , please try again');
        }
    });
}

function message(msg) {
    $('.boxtextcenter').empty();
    $('.boxtextcenter').append(msg);
}

