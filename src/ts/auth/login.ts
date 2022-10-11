import { api } from "../api/request";

const domain = location.href.split("/")[2];
let protocol = "https://";
const instance = location.href.split("?instance=")[1];
const scopes = "read write follow";

if (domain.startsWith("localhost")) {
    protocol = "http://";
}

const redirect_uri = protocol+domain+"/callback";

localStorage.setItem("instance", instance);
localStorage.setItem("scopes", scopes);
localStorage.setItem("redirect_uri", redirect_uri);

api(instance, "/api/v1/apps", false, "POST", {
    "client_name": "litterbox",
    "redirect_uris": redirect_uri,
    "scopes": scopes,
    "website": "https://litterbox.koyu.space"
}).then((data) => {
    localStorage.setItem("app", JSON.stringify(data));
    window.setTimeout(() => {
        location.href = `https://${instance}/oauth/authorize?client_id=${data.client_id}&scope=${scopes.replaceAll(" ", "+")}&redirect_uri=${encodeURI(redirect_uri)}&response_type=code`;
    }, 100);
});