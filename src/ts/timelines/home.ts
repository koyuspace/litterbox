import $ from "jquery";
import { api } from "../api/request"
import { renderTimeline } from "../ui/timeline";

export function loadHome() {
    let hreq = "/api/v1/timelines/home";
    if (localStorage.getItem("isnextpage") === "true") {
        hreq = hreq+"?max_id="+localStorage.getItem("last-element");
        localStorage.setItem("isnextpage", "false");
        window.setTimeout(() => {
            window.scrollTo(0,0);
        }, 500);
    }
    api(localStorage.getItem("instance"), hreq, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        if (data.length === 0) {
            $("#home").html("<div class='alert alert-warning'>No posts found. To discover new people <a href='https://communitywiki.org/trunk' target='_blank'>take a look here</a> or <a href='/action/post'>write your first post</a>.</div>");
        } else {
            $("#home").html(renderTimeline(data));
        }
    });
}