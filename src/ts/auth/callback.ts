import { api } from "../api/request";

const code = location.href.split("?code=")[1];
const app = JSON.parse(localStorage.getItem("app"));
const redirect_uri = localStorage.getItem("redirect_uri");
const scopes = localStorage.getItem("scopes");

api(localStorage.getItem("instance"), "/oauth/token", false, "POST", {
    "client_id": app.client_id,
    "client_secret": app.client_secret,
    "redirect_uri": redirect_uri,
    "grant_type": "authorization_code",
    "code": code,
    "scope": scopes
}).then((data) => {
    localStorage.setItem("token", data.access_token);
    window.setTimeout(() => {
        location.href = "/";
    }, 100);
});