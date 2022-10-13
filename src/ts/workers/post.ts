import $ from "jquery";
import { api } from "../api/request";
import{ renderTimeline } from "../ui/timeline";
import { goBack } from "./back";

let uploads = [];

export function loadPostForm() {
    const id = location.href.split("?id=")[1];
    if (id === undefined) {
        api(localStorage.getItem("instance"), "/api/v1/accounts/verify_credentials", true, "GET", {}, localStorage.getItem("token")).then((data) => {
            $(`#${data.source.privacy}`).attr("selected", "");
        });
    }
    if (id !== undefined) {
        api(localStorage.getItem("instance"), `/api/v1/statuses/${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
            if (data.reblog) {
                $(`#${data.reblog.visibility}`).attr("selected", "");
                if (data.reblog.account.id !== localStorage.getItem("userid")) {
                    $("#post-form").val(`@${data.reblog.account.acct} `);
                }
            } else {
                $(`#${data.visibility}`).attr("selected", "");
                if (data.account.id !== localStorage.getItem("userid")) {
                    $("#post-form").val(`@${data.account.acct} `);
                }
            }
            $("#post-form").focus();
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
        "media_ids": uploads,
        "poll": [],
        "visibility": $("#visibility").val(),
        "spoiler_text": $("#spoiler").val(),
        "in_reply_to_id": id,
        "sensitive": $("#spoiler").val() !== ""
    }, localStorage.getItem("token")).then((data) => {
        $("#post-form").val("");
        window.setTimeout(() => {
            location.href = `/thread?id=${data.id}`;
        }, 100);
    });
}

export function upload() {
    var input: any = document.getElementById("file");
    var file_data = input.files[0];
    let form_data = new FormData();
    form_data.append("file", file_data);
    api(localStorage.getItem("instance"), "/api/v1/media", true, "POST", form_data, localStorage.getItem("token"), true).then((data) => {
        uploads.push(data.id);
        localStorage.setItem("uploads", JSON.stringify(uploads));
        $("#file").val("");
        $("#media_attachments").append(`<img src="${data.url}" class="file" id="file-${data.id}" height="90">`);
        $(`#file-${data.id}`).click(() => {
            const id = $(`#file-${data.id}`).attr("id").replace("file-", "");
            let tmp = [];
            uploads.forEach((e) => {
                if (e !== id) {
                    tmp.push(e);
                }
            });
            uploads = tmp;
            localStorage.setItem("uploads", JSON.stringify(uploads));
            $(`#file-${data.id}`).hide();
        });
    });
}