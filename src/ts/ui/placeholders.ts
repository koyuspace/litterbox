import $ from "jquery";
import { api } from "../api/request";

let username = "%username%";
let userpic = "";
let instance = localStorage.getItem("instance");

api(instance, "/api/v1/accounts/verify_credentials", true, "GET", {}, localStorage.getItem("token")).then((data) => {
    username = data.username;
    userpic = data.avatar;
});

export function initializePlaceholders() {
    window.setInterval(() => {
        $(".username").html(username);
        $(".edit-profile").attr("href", `https://${instance}/settings/user/profile`);
    });
}

$(document).ready(() => {
    $(".userpic").attr("src", userpic);
    window.setInterval(() => {
        $(".userpic").attr("src", userpic);
    }, 1000);
});