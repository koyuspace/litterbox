import { api }  from "../api/request";
import { renderTimeline } from "./timeline";
import { renderProfileCards } from "./profile_cards";
import $ from "jquery";
import semver from "semver";

const iconFollow = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-plus"><g fill="currentColor"><path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path><path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path></g></svg>';
const iconUnfollow = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-dash-fill"><g fill="currentColor"><path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"></path><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></g></svg>';
const iconFollowPending = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:person-check-fill"><g fill="currentColor"><path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"></path><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></g></svg>';
const iconLock = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:lock-fill"><path fill="currentColor" d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path></svg>';
const iconBlock = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:slash-circle"><g fill="currentColor"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"></path></g></svg>';
const iconUnblock = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:slash-circle-fill"><path fill="currentColor" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.646-2.646a.5.5 0 0 0-.708-.708l-6 6a.5.5 0 0 0 .708.708l6-6z"></path></svg>';
const iconMute = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:eye-slash"><g fill="currentColor"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"></path><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"></path><path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"></path></g></svg>';
const iconUnmute = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:eye-slash-fill"><g fill="currentColor"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"></path><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"></path></g></svg>';
const iconNotify = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:bell"><path fill="currentColor" d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"></path></svg>';
const iconUnnotify = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:bell-slash-fill"><path fill="currentColor" d="M5.164 14H15c-1.5-1-2-5.902-2-7 0-.264-.02-.523-.06-.776L5.164 14zm6.288-10.617A4.988 4.988 0 0 0 8.995 2.1a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 7c0 .898-.335 4.342-1.278 6.113l9.73-9.73zM10 15a2 2 0 1 1-4 0h4zm-9.375.625a.53.53 0 0 0 .75.75l14.75-14.75a.53.53 0 0 0-.75-.75L.625 15.625z"></path></svg>';
const iconEnvelope = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:envelope-x"><g fill="currentColor"><path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2zm3.708 6.208L1 11.105V5.383l4.708 2.825zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2z"></path><path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zm-4.854-1.354a.5.5 0 0 0 0 .708l.647.646-.647.646a.5.5 0 0 0 .708.708l.646-.647.646.647a.5.5 0 0 0 .708-.708l-.647-.646.647-.646a.5.5 0 0 0-.708-.708l-.646.647-.646-.647a.5.5 0 0 0-.708 0z"></path></g></svg>';
const iconBackForth = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:arrow-left-right"><path fill="currentColor" fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"></path></svg>';

export function loadUser(id) {
    let html = "";
    let cd = [];
    api(localStorage.getItem("instance"), `/api/v1/accounts/${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        cd[0] = data;
    }).then(() => {
        $("#next").show();
        $("#loaduser").hide();
        api(localStorage.getItem("instance"), `/api/v1/accounts/relationships?id=${id}`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
            cd[1] = data[0];
        }).then(() => {
            var canNotify = false;
            api(localStorage.getItem("instance"), `/api/v1/instance`, true, "GET", {}, localStorage.getItem("token")).then((cdi2) => {
                canNotify = semver.satisfies(cdi2.version, ">=3.3.0")
            }).then(() => {
                let display_name = cd[0].display_name;
                try {
                    if (cd[0].emojis.length > 0) {
                        cd[0].emojis.forEach(dp_emoji => {
                            display_name = display_name.replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt=":${dp_emoji.shortcode}:" class="emoji">`);
                        });
                    }
                } catch (e) {}
                html += `<style>#user_card { background: linear-gradient(rgba(0,0,0,.75), rgba(0,0,0,.75)), url('${cd[0].header}') center center no-repeat;background-size: cover; }</style>`;
                html += "<div id=\"user_card\" class=\"center2\">"
                if (localStorage.getItem("userid") !== cd[0].id) {
                    if (!cd[1].requested) {
                        if (cd[1].following) {
                            html += `<a href="/action/unfollow?id=${cd[0].id}" id="followbutton" title="Unfollow">${iconUnfollow}</a> `;
                        } else {
                            html += `<a href="/action/follow?id=${cd[0].id}" id="followbutton" title="Follow">${iconFollow}</a> `;
                        }
                    } else {
                        html += `<a href="/action/unfollow?id=${cd[0].id}" id="followbutton" title="Follow pending">${iconFollowPending}</a> `
                    }
                    if (canNotify) {
                        if (cd[1].notifying) {
                            html += `<a href="/action/unnotify?id=${cd[0].id}" id="notifybutton">${iconUnnotify}</a>` ;
                        } else {
                            html += `<a href="/action/notify?id=${cd[0].id}" id="notifybutton">${iconNotify}</a> `;
                        }
                    }
                    if (cd[1].blocking) {
                        html += `<a href="/action/unblock?id=${cd[0].id}" id="blockbutton" title="Unblock">${iconUnblock}</a> `;
                    } else {
                        html += `<a href="/action/block?id=${cd[0].id}" id="blockbutton" title="Block">${iconBlock}</a> `;
                    }
                    if (cd[1].muting) {
                        html += `<a href="/action/unmute?id=${cd[0].id}" id="blockbutton" title="Unmute">${iconUnmute}</a>` ;
                    } else {
                        html += `<a href="/action/mute?id=${cd[0].id}" id="blockbutton" title="Mute">${iconMute}</a> `;
                    }
                    if (!cd[1].blocking) {
                        if (cd[1].followed_by && !cd[1].following) {
                            html += `<a href="/action/follow?id=${cd[0].id}" id="nfollowbutton" title="Follow back">${iconBackForth}</a> `;
                        }
                        if (cd[1].followed_by) {
                            html += `<a href="/action/makeunfollow?id=${cd[0].id}" id="makeunfollowbutton" title="Make the user unfollow you">${iconEnvelope}</a> `;
                        }
                    }
                }
                let lock = "";
                if (cd[0].locked) {
                    lock = iconLock;
                }
                if (!cd[1].blocking) {
                    html += `<br><br><h4><img src="${cd[0].avatar}" class="avatar" width="48" height="48" alt="${cd[0].display_name}'s Avatar"> ${display_name}</h4><br>`;
                } else {
                    html += `<h1>${display_name}</h1>`;
                }
                if (!cd[1].blocking) {
                    if (cd[1].followed_by) {
                        html += "<span class=\"badge bg-secondary\">Follows you!</span></p><br>";
                    } else {
                        if (cd[0].bot) {
                            html += "<span class=\"badge bg-secondary\">Bot</span></p><br>";
                        } else {
                            html += "</p>";
                        }
                    }
                    html += `<div id="acct">@${cd[0].acct} ${lock}</div>`;
                    let bio = cd[0].note;
                    if (cd[0].emojis.length > 0) {
                        cd[0].emojis.forEach(bio_emoji => {
                            bio = bio.replaceAll(`:${bio_emoji.shortcode}:`, `<img src="${bio_emoji.url}" alt=":${bio_emoji.shortcode}:" class="emoji">`);
                        });
                    }
                    if (cd[0].note !== "") {
                        html += `<div id="bio">${bio}</div>`;
                    }
                    let inaccurate = "";
                    if (cd[0].acct.includes("@")) {
                        inaccurate = `The statistics may be inaccurate since this is a remote profile. <a href="${cd[0].url}" target="_blank">Click here to view the remote profile.</a>`;
                        html += `<p>Posts: ${cd[0].statuses_count} | Followers: ${cd[0].followers_count} | Following: ${cd[0].following_count}<br><br><i style="display:inline-block; width:60%">${inaccurate}</i></p>`;
                    } else {
                        html += `<p>Posts: ${cd[0].statuses_count} | <a href="#" id="loadfollowers">Followers: ${cd[0].followers_count}</a> | <a href="#" id="loadfollowings">Following: ${cd[0].following_count}</a><br><br><i style="display:inline-block; width:60%">${inaccurate}</i></p>`;
                    }
                    if (cd[0].last_status_at !== "") {
                        let onlinedate = new Date(Date.parse(cd[0].last_status_at)).toLocaleString();
                        html += `<p>Last online: ${onlinedate}</p>`;
                    }
                }
                html += "</div>";
                if (!cd[1].blocking && cd[0].statuses_count === 0) {
                    $("#next").hide();
                }
                let ureq = `/api/v1/accounts/${id}/statuses`;
                if (localStorage.getItem("isnextpage") === "true") {
                    ureq = ureq+"?max_id="+localStorage.getItem("last-element");
                    localStorage.setItem("isnextpage", "false");
                    window.scrollTo(0,0);
                }
                api(localStorage.getItem("instance"), ureq, true, "GET", {}, localStorage.getItem("token")).then((data) => {
                    $("#user-content").html(renderTimeline(data));
                }).then(() => {
                    $("#user").html(html);
                    $("#loaduser").click((e) => {
                        e.preventDefault();
                        loadUser(id);
                    });
                    $("#loadfollowers").click((e) => {
                        e.preventDefault();
                        loadFollowers(id);
                    });
                    $("#loadfollowings").click((e) => {
                        e.preventDefault();
                        loadFollowings(id);
                    });
                }).catch(() => {
                    $("#user").html(html);
                    $("#loaduser").click((e) => {
                        e.preventDefault();
                        loadUser(id);
                    });
                    $("#loadfollowers").click((e) => {
                        e.preventDefault();
                        loadFollowers(id);
                    });
                    $("#loadfollowings").click((e) => {
                        e.preventDefault();
                        loadFollowings(id);
                    });
                });
            });
        });
    });
}

export function loadFollowers(id) {
    let html = "<div class=\"center2\"><h3>Followers</h3>";
    api(localStorage.getItem("instance"), `/api/v1/accounts/${id}/followers`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        html += renderProfileCards(data)+"</div>";
    }).then(() => {
        $("#user-content").html(html);
        $("#next").hide();
        $("#loaduser").show();
    })
}

export function loadFollowings(id) {
    let html = "<div class=\"center2\"><h3>Followings</h3>";
    api(localStorage.getItem("instance"), `/api/v1/accounts/${id}/following`, true, "GET", {}, localStorage.getItem("token")).then((data) => {
        html += renderProfileCards(data)+"</div>";
    }).then(() => {
        $("#user-content").html(html);
        $("#next").hide();
        $("#loaduser").show();
    })
}