import $ from "jquery";
import { api } from "../api/request"
import { renderTimeline } from "../ui/timeline";

export function loadBookmarks() {
    api(localStorage.getItem("instance"), "/api/v1/bookmarks", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        if (data.length === 0) {
            $("#bookmarks").html("<div class='alert alert-warning'>No posts found. To bookmark a post, click on the bookmark icon on a post.</div>");
        } else {
            $("#bookmarks").html(renderTimeline(data));
        }
    });
}