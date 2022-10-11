import { api } from "../api/request"
import { renderTimeline } from "../ui/timeline";

export function loadFavourites() {
    api(localStorage.getItem("instance"), "/api/v1/favourites", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        renderTimeline("#favourites", data);
    });
}