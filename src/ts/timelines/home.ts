import $ from "jquery";
import { api } from "../api/request"
import { renderTimeline } from "../ui/timeline";

export function loadHome() {
    let hreq = "/api/v1/timelines/home";
    if (localStorage.getItem("isnextpage") === "true") {
        hreq = hreq+"?max_id="+localStorage.getItem("last-element");
        localStorage.setItem("isnextpage", "false");
    }
    api(localStorage.getItem("instance"), hreq, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        $("#home").html(renderTimeline(data));
    });
}