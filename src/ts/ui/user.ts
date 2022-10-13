import { api }  from "../api/request";
import { renderTimeline } from "./timeline";
import $ from "jquery";

const iconFollow = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-plus"><g fill="currentColor"><path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path><path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path></g></svg>';
const iconUnfollow = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-dash-fill"><g fill="currentColor"><path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"></path><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></g></svg>';
const iconFollowPending = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-check-fill"><g fill="currentColor"><path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"></path><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></g></svg>';
const iconLock = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:lock-fill"><path fill="currentColor" d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path></svg>';
const iconReload = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:arrow-clockwise"><g fill="currentColor"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"></path><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"></path></g></svg>';
const iconBlock = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:slash-circle"><g fill="currentColor"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"></path></g></svg>';
const iconUnblock = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:slash-circle-fill"><path fill="currentColor" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.646-2.646a.5.5 0 0 0-.708-.708l-6 6a.5.5 0 0 0 .708.708l6-6z"></path></svg>';
const iconMute = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:eye-slash"><g fill="currentColor"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path><path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path></g></svg>';
const iconUnmute = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:eye-slash-fill"><g fill="currentColor"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"></path><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"></path></g></svg>';

export function loadUser(id) {
    let html = "";
    let cd = [];
    api(localStorage.getItem("instance"), `/api/v1/accounts/${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        cd[0] = data;
    }).then(() => {
        api(localStorage.getItem("instance"), `/api/v1/accounts/relationships?id=${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
            cd[1] = data[0];
        }).then(() => {
            let display_name = cd[0].display_name;
            try {
                if (cd[0].emojis.length > 0) {
                    cd[0].emojis.forEach(dp_emoji => {
                        display_name = display_name.replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt="Emoji ${dp_emoji.shortcode}" class="emoji">`);
                    });
                }
            } catch (e) {}
            html += `<style>#user_card { background: linear-gradient(rgba(0,0,0,.75), rgba(0,0,0,.75)), url('${cd[0].header}');</style>`;
            html += "<div id=\"user_card\">"
            if (localStorage.getItem("userid") !== cd[0].id) {
                if (!cd[1].requested) {
                    if (cd[1].following) {
                        html += `<a href="/action/unfollow?id=${cd[0].id}" id="followbutton">${iconUnfollow}</a> `;
                    } else {
                        html += `<a href="/action/follow?id=${cd[0].id}" id="followbutton">${iconFollow}</a> `;
                    }
                } else {
                    html += `<a href="/action/unfollow?id=${cd[0].id}" id="followbutton">${iconFollowPending}</a> `
                }
                console.log(cd[1]);
                if (cd[1].blocking) {
                    html += `<a href="/action/unblock?id=${cd[0].id}" id="blockbutton">${iconUnblock}</a> `;
                } else {
                    html += `<a href="/action/block?id=${cd[0].id}" id="blockbutton">${iconBlock}</a> `;
                }
                if (cd[1].muting) {
                    html += `<a href="/action/unmute?id=${cd[0].id}" id="blockbutton">${iconUnmute}</a>` ;
                } else {
                    html += `<a href="/action/mute?id=${cd[0].id}" id="blockbutton">${iconMute}</a> `;
                }
            }
            let lock = "";
            if (cd[0].locked) {
                lock = iconLock;
            }
            if (!cd[1].blocking) {
                html += `<p><h1><img src="${cd[0].avatar}" class="avatar" width="64" height="64" alt="${cd[0].display_name}'s Avatar"> ${display_name}</h1>`;
            } else {
                html += `<h1>${display_name}</h1>`;
            }
            if (!cd[1].blocking) {
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
                html += `<p>Last online: ${onlinedate}</p>`;
            }
            html += "</div>";
            if (!cd[1].blocking) {
                html += `<br><br><button onclick="location.reload()" id="reload" class="btn btn-primary" style="float:right;">${iconReload}</button><br><br>`;
            } else {
                $("#next").hide();
                $("#reload").hide();
            }
            let ureq = `/api/v1/accounts/${id}/statuses`;
            if (localStorage.getItem("isnextpage") === "true") {
                ureq = ureq+"?max_id="+localStorage.getItem("last-element");
                localStorage.setItem("isnextpage", "false");
            }
            api(localStorage.getItem("instance"), ureq, true, "GET", {}, localStorage.getItem("token")).then((data) => {
                html += renderTimeline(data);
            }).then(() => {
                $("#user").html(html);
            }).catch(() => {
                $("#user").html(html);
            });
        });
    });
}