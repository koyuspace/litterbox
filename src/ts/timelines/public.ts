import $ from "jquery";
import { api } from "../api/request";
import { renderTimeline } from "../ui/timeline";

export function loadPublic() {
    api(localStorage.getItem("instance"), "/api/v1/timelines/public", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        $("#public").html(renderTimeline(data));
    });
}