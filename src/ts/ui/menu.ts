import $ from "jquery";
import { api } from "../api/request";

const domain = location.href.split("/")[2];
let protocol = "https://";

if (domain.startsWith("localhost")) {
    protocol = "http://";
}

let page = location.href.replace(/\/+$/, '').replace(protocol+domain+"/", "").replaceAll("/", "--").split("?")[0];

$(`#nav-${page.replaceAll("#", "")}`).attr("class", "nav-link active");

api(localStorage.getItem("instance"), "/api/v1/accounts/verify_credentials", true, "GET", {}, localStorage.getItem("token")).then((data) => {
    if (!data.locked) {
        $("#nav-follow_requests").hide();
    }
});

function loadNotificationLength() {
    api(localStorage.getItem("instance"), "/api/v1/notifications", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        $("#nav-notifications").html("Notifications ("+data.length+")");
    });
}
loadNotificationLength();

window.setInterval(loadNotificationLength, 5000);