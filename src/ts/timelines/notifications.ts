import { api } from "../api/request"
import { renderNotifications } from "../ui/notifications";

export function loadNotifications() {
    api(localStorage.getItem("instance"), "/api/v1/notifications", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        return renderNotifications(data);
    });
}