import $ from "jquery";
import { api } from "../api/request"
import { renderTimeline } from "../ui/timeline";

export function loadFavourites() {
    api(localStorage.getItem("instance"), "/api/v1/favourites", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        if (data.length === 0) {
            $("#favourites").html("<div class='alert alert-warning'>No posts found. To favourite a post, click on the star icon on a post.</div>");
        } else {
            $("#favourites").html(renderTimeline(data));
        }
    });
}