import $ from "jquery";
import { api } from "../api/request";

let username = "%username%";
let userpic = "";
let userid = "";
let acct = "";
let instance = localStorage.getItem("instance");

api(
  instance,
  "/api/v1/accounts/verify_credentials",
  true,
  "GET",
  {},
  localStorage.getItem("token")
).then((data) => {
  username = data.username;
  userpic = data.avatar;
  userid = data.id;
  acct = data.acct;
  localStorage.setItem("userid", data.id);
});

export function initializePlaceholders() {
  window.setInterval(() => {
    $(".username").html(username);
    $(".edit-profile").attr("href", `https://${instance}/settings/profile`);
  });
}

$(document).ready(() => {
  $(".userpic").attr("src", userpic);
  $(".userlink").attr("href", `https://${instance}/@${acct}`);
  window.setInterval(() => {
    $(".userpic").attr("src", userpic);
    $(".userlink").attr("href", `https://${instance}/@${acct}`);
  }, 1000);
});
