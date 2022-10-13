import $ from "jquery";
import { api } from "../api/request";

export function renderFollowRequests() {
    let html = "";
    api(localStorage.getItem("instance"), "/api/v1/follow_requests", true, "GET", {}, localStorage.getItem("token")).then((data) => {
        const id = location.href.split("?id=")[1];
        data.forEach(element => {
            let display_name = element.display_name;
            if (element.emojis.length > 0) {
                element.emojis.forEach(dp_emoji => {
                    display_name = display_name.replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt="Emoji ${dp_emoji.shortcode}" class="emoji">`);
                });
            }
            html += `<style>#fr-${element.id} { background: linear-gradient(rgba(0,0,0,.75), rgba(0,0,0,.75)), url('${element.header}');</style>`;
            html += `<div class="user-card" id="fr-${element.id}">`;
            html += `<p><h1><img src="${element.avatar}" class="avatar" width="64" height="64" alt="${element.display_name}'s Avatar"> ${display_name}</h1>`
            html += `<p style="font-size:8pt;">@${element.acct}</p>`;
            html += `
            <p><div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <a href="/action/follow_request/approve?id=${element.id}" class="btn btn-success">Approve</a>
                <a href="/action/follow_request/approveandfollow?id=${element.id}" class="btn btn-warning">Approve & Follow</a>
                <a href="/action/follow_request/decline?id=${element.id}" class="btn btn-danger">Decline</a>
            </div></p></div><br>
            `;
            $(document).ready(() => {
                if (id !== undefined) {
                    if (element.id !== id) {
                        $("#fr-"+element.id).hide();
                    }
                }
            });
        })
        if (data.length === 0) {
            html += "<i>No pending follow requests</i>";
        }
        $("#follow_requests").html(html);
    });
}