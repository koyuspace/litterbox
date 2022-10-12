import $ from "jquery";
import { api } from "../api/request";

api(localStorage.getItem("instance"), "/api/v1/accounts/verify_credentials", true, "GET", {}, localStorage.getItem("token")).then((ad) => {
    localStorage.setItem("acct", ad.acct);
});

const iconDelete = '<svg viewBox="0 0 16 16" astro-icon="bi:trash"><g fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path></g></svg>';
const iconFav = '<svg viewBox="0 0 16 16" astro-icon="bi:star"><path fill="currentColor" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path></svg>';
const iconUnfav = '<svg viewBox="0 0 16 16" astro-icon="bi:star-fill"><path fill="currentColor" d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg>';
const iconBoost = '<svg viewBox="0 0 16 16" astro-icon="bi:arrow-repeat"><g fill="currentColor"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"></path></g></svg>';

export function renderTimeline(selector, data, threadmode=false, ispost=false) {
    $(selector).html("");
    data.forEach(element => {
        let status = "";
        if (ispost) {
            status = "<div class=\"card bg-darker status\" id=\"post\">";
        } else {
            status = "<div class=\"card bg-dark status\">";
        }
        let display_name = element.account.display_name;
        status += `<p><b class="display-name" id="dp-${element.account.id}">${display_name}</b></p>`;
        if (element.spoiler_text !== "") {
            status += `
            <p><a data-bs-toggle="collapse" href="#collapse-status-${element.id}" role="button" aria-expanded="false" aria-controls="collapse-status-${element.id}">
                <i>${element.spoiler_text}</i> (click to open)
            </a>
            <div class="collapse" id="collapse-status-${element.id}">
                ${element.content}
            </div></p>
            `
        } else {
            status += `<p>${element.content}</p>`;
        }
        if (element.media_attachments.length > 0) {
            status += "<p id=\"attachments\">";
            element.media_attachments.forEach((attachment) => {
                if (!element.sensitive) {
                    if (attachment.type === "image") {
                        status += `<a href="${attachment.url}" target="_blank"><img src="${attachment.preview_url}" class="attachment" width="300" alt="${attachment.description}"></a> `;
                    }
                    if (attachment.type === "video") {
                        status += `<video src=${attachment.url} width="300" alt="${attachment.description}" class="attachment" controls></video> `;
                    }
                } else {
                    status += `<a href="${attachment.url}" target="_blank"><img src="/nsfw.png" class="attachment" width="300" alt="${attachment.description}"></a> `;
                }
            });
            status += "</p>";
        }
        const acct = localStorage.getItem("acct");
        status += "<p class=\"actions\">";
        if (element.account.acct === acct) {
            status += `<a href="/action/delete?id=${element.id}" class="btn btn-danger">${iconDelete}</a> `;
        }
        if (threadmode) {
            if (!element.favourited) {
                status += `<a href="/action/fav?id=${element.id}" class="btn btn-warning">${iconFav}</a> `;
            } else {
                status += `<a href="/action/unfav?id=${element.id}" class="btn btn-warning">${iconUnfav}</a> `;
            }
            if (!element.reblogged) {
                status += `<a href="/action/boost?id=${element.id}" class="btn btn-secondary">${iconBoost}</a> `;
            } else {
                status += `<a href="/action/unboost?id=${element.id}" class="btn btn-primary">${iconBoost}</a> `;
            }
        }
        status += "</p><br>";
        let statusdate = new Date(Date.parse(element.created_at)).toLocaleString();
        status += `<p><a href="/thread?id=${element.id}">${statusdate}</p>`
        status += "</div>";
        $(selector).append(status);
        if (element.account.emojis.length > 0) {
            element.account.emojis.forEach(dp_emoji => {
                $(`#dp-${element.account.id}`).html($(`#dp-${element.account.id}`).html().replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt="Emoji ${dp_emoji.shortcode}" class="emoji">`));
            });
        }
    });
}