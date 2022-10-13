import { api }  from "../api/request";
import { renderTimeline } from "./timeline";
import $ from "jquery";

const iconFollow = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-plus"><g fill="currentColor"><path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path><path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path></g></svg>';
const iconUnfollow = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-dash-fill"><g fill="currentColor"><path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"></path><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></g></svg>';
const iconFollowPending = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-check-fill"><g fill="currentColor"><path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"></path><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></g></svg>';
const iconLock = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:lock-fill"><path fill="currentColor" d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path></svg>';
const iconReload = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:arrow-clockwise"><g fill="currentColor"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"></path><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"></path></g></svg>'

export function loadUser(id) {
    let html = "";
    let cd = [];
    let ureq = `/api/v1/accounts/${id}/statuses`;
    if (localStorage.getItem("isnextpage") === "true") {
        ureq = ureq+"?max_id="+localStorage.getItem("last-element");
        localStorage.setItem("isnextpage", "false");
    }
    api(localStorage.getItem("instance"), `/api/v1/accounts/${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        cd[0] = data;
    }).then(() => {
        api(localStorage.getItem("instance"), `/api/v1/accounts/relationships?id=${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
            cd[1] = data[0];
        }).then(() => {
            api(localStorage.getItem("instance"), ureq, true, "GET", {}, localStorage.getItem("token")).then((data) => {
                cd[2] = data;
            }).then(() => {
                let display_name = cd[0].display_name;
                if (cd[0].emojis.length > 0) {
                    cd[0].emojis.forEach(dp_emoji => {
                        display_name = display_name.replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt="Emoji ${dp_emoji.shortcode}" class="emoji">`);
                    });
                }
                html += `<style>#user_card { background: linear-gradient(rgba(0,0,0,.75), rgba(0,0,0,.75)), url('${cd[0].header}');</style>`;
                html += "<div id=\"user_card\">"
                if (localStorage.getItem("userid") !== cd[0].id) {
                    if (!cd[1].requested) {
                        if (cd[1].following) {
                            html += `<a href="/action/unfollow?id=${cd[0].id}" id="followbutton">${iconUnfollow}</a>`;
                        } else {
                            html += `<a href="/action/follow?id=${cd[0].id}" id="followbutton">${iconFollow}</a>`;
                        }
                    } else {
                        html += `<a href="/action/unfollow?id=${cd[0].id}" id="followbutton">${iconFollowPending}</a>`
                    }
                }
                let lock = "";
                if (cd[0].locked) {
                    lock = iconLock;
                }
                html += `<p><h1><img src="${cd[0].avatar}" class="avatar" width="64" height="64" alt="${cd[0].display_name}'s Avatar"> ${display_name}</h1>`
                if (cd[1].followed_by) {
                    html += "<span class=\"badge bg-secondary\">Follows you!</span></p><br>";
                } else {
                    html += "</p>";
                }
                html += `<div id="acct">@${cd[0].acct} ${lock}</div>`;
                html += `<div id="bio">${cd[0].note}</div>`;
                let inaccurate = "";
                if (cd[0].acct.includes("@")) {
                    
                    inaccurate = `The statistics may be inaccurate since this is a remote profile. <a href="https://${cd[0].acct.split("@")[1]}/users/${cd[0].acct.split("@")[0]}" target="_blank">Click here to view the remote profile.</a>`;
                }
                html += `<p>Posts: ${cd[0].statuses_count} | Followers: ${cd[0].followers_count} | Following: ${cd[0].following_count}<br><br><i style="display:inline-block; width:60%">${inaccurate}</i></p>`;
                let onlinedate = new Date(Date.parse(cd[0].last_status_at)).toLocaleString();
                html += `<p>Last online: ${onlinedate}</p>`
                html += "</div>"
                html += `<br><br><button onclick="location.reload()" class="btn btn-primary" style="float:right;">${iconReload}</button><br><br>`;
                html += renderTimeline(cd[2]);
                $("#user").html(html);
            });
        });
    });
}