import $ from "jquery";
import { api } from "../api/request";
import { renderTimeline } from "./timeline";

export function loadSearch(query) {
    $("#query").val(decodeURIComponent(query));
    api(localStorage.getItem("instance"), `/api/v2/search?q=${query}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        let html = "";
        html += "<br><h1>Accounts</h1>";
        if (data.accounts.length === 0) {
            html += "<p>No accounts found.</p>";
        } else {
            data.accounts.forEach((account) => {
                let display_name = account.display_name;
                if (account.emojis.length > 0) {
                    account.emojis.forEach(dp_emoji => {
                        display_name = display_name.replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt="Emoji ${dp_emoji.shortcode}" class="emoji">`);
                    });
                }
                html += `<p><a href="/user?id=${account.id}"><img src="${account.avatar}" class="avatar" width="16" height="16" alt="${account.display_name}'s Avatar"> `;
                html += `${display_name}</a></p>`;
            });
        }
        html += "<br><h1>Statuses</h1>";
        if (data.statuses.length === 0) {
            html += "<p>No statuses found.</p>";
        } else {
            html += renderTimeline(data.statuses);
        }
        html += "<br><h1>Hashtags</h1>";
        if (data.hashtags.length === 0) {
            html += "<p>No hashtags found.</p>";
        } else {
            data.hashtags.forEach((hashtag) => {
                html += `<p><a href="${hashtag.url}" target="_blank">${hashtag.name}</a>`;
            });
        }
        $("#search").html(html);
    });
}