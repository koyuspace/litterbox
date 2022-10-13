import $ from "jquery";
import { api } from "../api/request";
import{ renderTimeline } from "../ui/timeline";

export function loadPostForm() {
    api(localStorage.getItem("instance"), "/api/v1/accounts/verify_credentials", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        $(`#${data.source.privacy}`).attr("selected", "");
    });
    const id = location.href.split("?id=")[1];
    if (id !== undefined) {
        api(localStorage.getItem("instance"), `/api/v1/statuses/${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
            if (data.reblog) {
                if (data.reblog.account.id !== localStorage.getItem("userid")) {
                    $("#post-form").val(`@${data.reblog.account.acct} `);
                }
            } else {
                if (data.account.id !== localStorage.getItem("userid")) {
                    $("#post-form").val(`@${data.account.acct} `);
                }
            }
            $("#context").html(renderTimeline([data]));
        });
    }
}

export function post() {
    let id = location.href.split("?id=")[1];
    if (id === undefined) {
        id = "";
    }
    api(localStorage.getItem("instance"), "/api/v1/statuses", true, "POST", {
        "status": $("#post-form").val(),
        "media_ids": [],
        "poll": [],
        "visibility": $("#visibility").val(),
        "spoiler_text": $("#spoiler").val(),
        "in_reply_to_id": id
    }, localStorage.getItem("token")).then(() => {
        $("#post-form").val("");
        window.setTimeout(() => {
            location.reload();
        }, 100);
    });
}