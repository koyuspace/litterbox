import $ from "jquery";
import { api } from "../api/request";
import { renderTimeline } from "../ui/timeline";

export function loadLocal() {
    api(localStorage.getItem("instance"), "/api/v1/timelines/public?local=true", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        if (data.length === 0) {
            $("#local").html("<div class='alert alert-warning'>No posts found. Invite some people to your server or post publicly and posts will show up here.</div>");
        } else {
            $("#local").html(renderTimeline(data));
        }
    });
}