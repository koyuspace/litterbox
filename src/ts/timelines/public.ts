import $ from "jquery";
import { api } from "../api/request";
import { renderTimeline } from "../ui/timeline";

export function loadPublic() {
    api(localStorage.getItem("instance"), "/api/v1/timelines/public", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        if (data.length === 0) {
            $("#public").html("<div class='alert alert-warning'>No posts found. To discover new people <a href='https://communitywiki.org/trunk' target='_blank'>take a look here</a>.</div>");
        } else {
            $("#public").html(renderTimeline(data));
        }
    });
}