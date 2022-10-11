import { api } from "../api/request"
import { renderTimeline } from "../ui/timeline";

export function loadLocal() {
    api(localStorage.getItem("instance"), "/api/v1/timelines/public?local=true", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        renderTimeline("#local", data);
    });
}