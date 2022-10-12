import { renderTimeline } from "./timeline";
import { api } from "../api/request";

export function loadThread(id) {
    api(localStorage.getItem("instance"), `/api/v1/statuses/${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        renderTimeline("#status", [data], true, true);
    });
    api(localStorage.getItem("instance"), `/api/v1/statuses/${id}/context`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        renderTimeline("#ancestors", data.ancestors, true, false);
        renderTimeline("#descendants", data.descendants, true), false;
        try {
            const el = document.getElementById("post");
            el.scrollIntoView();
        } catch (e)  {}
    });
}