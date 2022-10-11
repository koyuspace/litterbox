import $ from "jquery";

export async function api(instance, req, login=false, method="GET", d={}, token=undefined) {
    let r = undefined;
    await $.ajax({
        url: "https://"+instance+req,
        type: method,
        beforeSend: function (xhr) {
            if (login) {
                xhr.setRequestHeader('Authorization', 'Bearer '+token);
            }
        },
        data: d,
        success: function (rd) {
            r = rd;
        },
        error: function () {
            r = null;
        },
    });
    return r;
}