import { api } from "../api/request";

api(localStorage.getItem("instance"), "/api/v1/accounts/verify_credentials", true, "GET", {}, localStorage.getItem("token")).then((ad) => {
    localStorage.setItem("acct", ad.acct);
});

const iconDelete = '<svg viewBox="0 0 16 16" astro-icon="bi:trash"><g fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path></g></svg>';
const iconFav = '<svg viewBox="0 0 16 16" astro-icon="bi:star"><path fill="currentColor" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path></svg>';
const iconUnfav = '<svg viewBox="0 0 16 16" astro-icon="bi:star-fill"><path fill="currentColor" d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg>';
const iconBoost = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:arrow-repeat"><g fill="currentColor"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"></path></g></svg>';
const iconReply = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:arrow-90deg-left"><path fill="currentColor" fill-rule="evenodd" d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4z"></path></svg>';
const iconCopy = '<svg viewBox="0 0 16 16" class="icon" astro-icon="bi:file-earmark-fill"><path fill="currentColor" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"></path></svg>';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function renderTimeline(data, threadmode=false, ispost=false) {
    let statuses = [];
    data.forEach(element => {
        let status = "";
        if (ispost) {
            status = "<div class=\"card bg-darker status\" id=\"post\">";
        } else {
            status = "<div class=\"card bg-dark status\">";
        }
        status += `<div style="text-align: right;margin:10px;"><a href="/user?id=${element.account.id}"><img src="${element.account.avatar}" class="avatar" width="64" height="64" alt="${element.account.display_name}'s Avatar"></a></div>`;
        let display_name = element.account.display_name;
        if (element.account.emojis.length > 0) {
            element.account.emojis.forEach(dp_emoji => {
                display_name = display_name.replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt="Emoji ${dp_emoji.shortcode}" class="emoji">`);
            });
        }
        status += `<p style="margin-top:-74px;"><b class="display-name" id="dp-${element.account.id}">${display_name}</b></p>`;
        if (element.spoiler_text !== "") {
            let content = "";
            if (element.reblog !== null) {
                let reblog_display_name = element.reblog.account.display_name;
                if (element.reblog.account.emojis.length > 0) {
                    element.reblog.account.emojis.forEach(rdp_emoji => {
                        reblog_display_name = reblog_display_name.replaceAll(`:${rdp_emoji.shortcode}:`, `<img src="${rdp_emoji.url}" alt="Emoji ${rdp_emoji.shortcode}" class="emoji">`);
                    });
                }
                status += `<p><b>${iconBoost} <a href="/user?id=${element.reblog.account.id}"><img src="${element.reblog.account.avatar}" class="avatar" width="16" height="16" alt="${element.reblog.display_name}'s Avatar"></a> Boosted ${reblog_display_name}</b></p><br>`;
                content = element.reblog.content;
            }
            if (element.reblog === null) {
                content = element.content;
                if (element.emojis.length > 0) {
                    element.emojis.forEach(pc_emoji => {
                        content = content.replaceAll(`:${pc_emoji.shortcode}:`, `<img src="${pc_emoji.url}" alt="Emoji ${pc_emoji.shortcode}" class="emoji">`);
                    });
                }
            } else {
                if (element.reblog.emojis.length > 0) {
                    element.reblog.emojis.forEach(rpc_emoji => {
                        content = content.replaceAll(`:${rpc_emoji.shortcode}:`, `<img src="${rpc_emoji.url}" alt="Emoji ${rpc_emoji.shortcode}" class="emoji">`);
                    });
                }
            }
            content = content.replaceAll("<a href=\"", "<a target=\"_blank\" href=\"");
            status += `
            <p style="margin-top:35px;"><a data-bs-toggle="collapse" href="#status-${element.id}" role="button" aria-expanded="false" aria-controls="status-${element.id}">
                <i>${element.spoiler_text}</i> (click to open)
            </a>
            <div class="collapse" class="status-content" id="status-${element.id}">
                ${content}
            </div></p>
            `
        } else {
            let content = "";
            if (element.reblog !== null) {
                let reblog_display_name = element.reblog.account.display_name;
                if (element.reblog.account.emojis.length > 0) {
                    element.reblog.account.emojis.forEach(rdp_emoji => {
                        reblog_display_name = reblog_display_name.replaceAll(`:${rdp_emoji.shortcode}:`, `<img src="${rdp_emoji.url}" alt="Emoji ${rdp_emoji.shortcode}" class="emoji">`);
                    });
                }
                status += `<p><b>${iconBoost} <a href="/user?id=${element.reblog.account.id}"><img src="${element.reblog.account.avatar}" class="avatar" width="16" height="16" alt="${element.reblog.display_name}'s Avatar"></a> Boosted ${reblog_display_name}</b></p><br>`;
                content = element.reblog.content;
            }
            if (element.reblog === null) {
                content = element.content;
                if (element.emojis.length > 0) {
                    element.emojis.forEach(pc_emoji => {
                        content = content.replaceAll(`:${pc_emoji.shortcode}:`, `<img src="${pc_emoji.url}" alt="Emoji ${pc_emoji.shortcode}" class="emoji">`);
                    });
                }
            } else {
                if (element.reblog.emojis.length > 0) {
                    element.reblog.emojis.forEach(rpc_emoji => {
                        content = content.replaceAll(`:${rpc_emoji.shortcode}:`, `<img src="${rpc_emoji.url}" alt="Emoji ${rpc_emoji.shortcode}" class="emoji">`);
                    });
                }
            }
            content = content.replaceAll("<a href=\"", "<a target=\"_blank\" href=\"");
            status += `<p id="status-${element.id}" style="margin-top:35px;"  class="status-content">${content}</p>`;
        }
        if (element.media_attachments.length > 0) {
            status += "<p class=\"attachments\">";
            element.media_attachments.forEach((attachment) => {
                if (!element.sensitive) {
                    if (attachment.type === "image") {
                        status += `<a href="${attachment.url}" target="_blank"><img src="${attachment.preview_url}" class="attachment" width="300" alt="${attachment.description}"></a> `;
                    }
                    if (attachment.type === "video") {
                        status += `<video src=${attachment.url} width="300" alt="${attachment.description}" class="attachment" controls></video> `;
                    }
                    if (attachment.type === "audio") {
                        status += `<audio src=${attachment.url} alt="${attachment.description}" class="attachment" controls></audio> `;
                    }
                    if (attachment.type === "gifv") {
                        status += `<video src=${attachment.url} width="300" alt="${attachment.description}" class="attachment" autoplay muted loop></video> `;
                    }
                } else {
                    status += `<a href="${attachment.url}" target="_blank"><img src="/nsfw.png" class="attachment" width="300" alt="${attachment.description}"></a> `;
                }
            });
            status += "</p>";
        }
        if (element.reblog !== null) {
            if (element.reblog.media_attachments.length > 0) {
                status += "<p class=\"attachments\">";
                element.reblog.media_attachments.forEach((attachment) => {
                    if (!element.sensitive) {
                        if (attachment.type === "image") {
                            status += `<a href="${attachment.url}" target="_blank"><img src="${attachment.preview_url}" class="attachment" width="300" alt="${attachment.description}"></a> `;
                        }
                        if (attachment.type === "video") {
                            status += `<video src=${attachment.url} width="300" alt="${attachment.description}" class="attachment" controls></video> `;
                        }
                        if (attachment.type === "audio") {
                            status += `<audio src=${attachment.url} alt="${attachment.description}" class="attachment" controls></audio> `;
                        }
                        if (attachment.type === "gifv") {
                            status += `<video src=${attachment.url} width="300" alt="${attachment.description}" class="attachment" autoplay muted loop></video> `;
                        }
                    } else {
                        status += `<a href="${attachment.url}" target="_blank"><img src="/nsfw.png" class="attachment" width="300" alt="${attachment.description}"></a> `;
                    }
                });
                status += "</p>";
            }
        }
        const acct = localStorage.getItem("acct");
        status += "<p class=\"actions\">";
        if (element.account.acct === acct) {
            status += `<a href="/action/delete?id=${element.id}" class="btn btn-danger">${iconDelete}</a> `;
        }
        if (threadmode) {
            if (!element.reblog) {
                if (!element.favourited) {
                    status += `<a href="/action/fav?id=${element.id}" class="btn btn-warning">${iconFav} ${element.favourites_count}</a> `;
                } else {
                    status += `<a href="/action/unfav?id=${element.id}" class="btn btn-warning">${iconUnfav} ${element.favourites_count}</a> `;
                }
                if (!element.reblogged) {
                    status += `<a href="/action/boost?id=${element.id}" class="btn btn-secondary">${iconBoost} ${element.reblogs_count}</a> `;
                } else {
                    status += `<a href="/action/unboost?id=${element.id}" class="btn btn-primary">${iconBoost} ${element.reblogs_count}</a> `;
                }
                status += `<a href="/action/reply?id=${element.id}" class="btn btn-secondary">${iconReply} ${element.replies_count}</a> `;
            } else {
                if (!element.reblog.favourited) {
                    status += `<a href="/action/fav?id=${element.reblog.id}" class="btn btn-warning">${iconFav}</a> `;
                } else {
                    status += `<a href="/action/unfav?id=${element.reblog.id}" class="btn btn-warning">${iconUnfav}</a> `;
                }
                if (!element.reblog.reblogged) {
                    status += `<a href="/action/boost?id=${element.reblog.id}" class="btn btn-secondary">${iconBoost}</a> `;
                } else {
                    status += `<a href="/action/unboost?id=${element.reblog.id}" class="btn btn-primary">${iconBoost}</a> `;
                }
                status += `<a href="/action/reply?id=${element.reblog.id}" class="btn btn-secondary">${iconReply}</a> `;
            }
        }
        status += "</p><br>";
        let statusdate = new Date(Date.parse(element.created_at)).toLocaleString();
        if (element.reblog === null) {
            status += `<p><a href="/thread?id=${element.id}">${statusdate}</a> | ${capitalizeFirstLetter(element.visibility)} | <a href="javascript: navigator.clipboard.writeText('${element.url}')" class="text-white" style="text-decoration:none;">${iconCopy} Copy link</a></p>`;
        } else {
            status += `<p><a href="/thread?id=${element.reblog.id}">${statusdate}</a> | ${capitalizeFirstLetter(element.visibility)} | <a href="javascript: navigator.clipboard.writeText('${element.reblog.url}')" class="text-white" style="text-decoration:none;">${iconCopy} Copy link</a></p>`;
        }
        status += "</div>";
        localStorage.setItem("last-element", element.id);
        statuses.push(status)
    });
    let html = "";
    statuses.forEach((se) => {
        html += se;
    });
    return html;
}