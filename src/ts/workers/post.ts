import $ from "jquery";
import { api } from "../api/request";

export function post(selector) {
    api(localStorage.getItem("instance"), "/api/v1/statuses", true, "POST", {
        "status": $(selector).val(),
        "media_ids": [],
        "poll": []
    }, localStorage.getItem("token")).then(() => {
        $(selector).val("");
        window.setTimeout(() => {
            location.reload();
        }, 100);
    });
}