import { api } from "../api/request"
import { renderTimeline } from "../ui/timeline";

export function loadHome() {
    api(localStorage.getItem("instance"), "/api/v1/timelines/home", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        renderTimeline("#home", data);
    });
}