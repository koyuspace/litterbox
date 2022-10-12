import $ from "jquery";
import { api } from "../api/request";

export function loadPostForm() {
    api(localStorage.getItem("instance"), "/api/v1/accounts/verify_credentials", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        $(`#${data.source.privacy}`).attr("selected", "");
    });
}

export function post(selector, visibility, spoiler) {
    api(localStorage.getItem("instance"), "/api/v1/statuses", true, "POST", {
        "status": $(selector).val(),
        "media_ids": [],
        "poll": [],
        "visibility": $(visibility).val(),
        "spoiler_text": $(spoiler).val()
    }, localStorage.getItem("token")).then(() => {
        $(selector).val("");
        window.setTimeout(() => {
            location.reload();
        }, 100);
    });
}