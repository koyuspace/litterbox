import $ from "jquery";
import { api } from "../api/request";
import { Md5 } from "ts-md5";

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

api(localStorage.getItem("instance"), "/api/v1/instance", true, "GET", {}, localStorage.getItem("token")).then((data) => {
    $(".navbar-brand").html(`<img src="${data.thumbnail}" id="logo" alt="Logo"> ${data.title}`);
    document.title = data.title;
});

let fediid = localStorage.getItem("acct");
if (!fediid.includes("@")) {
    fediid = fediid+"@"+localStorage.getItem("instance");
}
const callHandle = Md5.hashStr(fediid+"cutebox");
$("#topcallbutton").attr("href", "https://meet.jit.si/"+callHandle);
$("#topcallbutton").attr("target", "_blank");