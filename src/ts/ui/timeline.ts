import $ from "jquery";

export function renderTimeline(selector, data) {
    $(selector).html("");
    data.forEach(element => {
        let status = "<div class=\"card bg-dark status\">";
        let display_name = element.account.display_name;
        status += `<p><b class="display-name" id="dp-${element.account.id}">${display_name}</b></p>`;
        status += `<p>${element.content}</p>`;
        if (element.media_attachments.length > 0) {
            status += "<p>";
            element.media_attachments.forEach((attachment) => {
                if (attachment.type === "image") {
                    status += `<a href="${attachment.url}" target="_blank"><img src=${attachment.preview_url} width="300" alt="${attachment.description}"></a> `;
                }
                if (attachment.type === "video") {
                    status += `<video src=${attachment.url} width="300" alt="${attachment.description}" controls></video> `;
                }
            });
            status += "</p>";
        }
        let statusdate = new Date(Date.parse(element.created_at)).toLocaleString();
        let statusurl = element.url;
        if (element.url === "") {
            statusurl = element.uri;
        }
        status += `<p><a href="${statusurl}" target="_blank">${statusdate}</p>`
        status += "</div>";
        $(selector).append(status);
        if (element.account.emojis.length > 0) {
            element.account.emojis.forEach(dp_emoji => {
                $(`#dp-${element.account.id}`).html($(`#dp-${element.account.id}`).html().replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt="Emoji ${dp_emoji.shortcode}" class="emoji">`));
            });
        }
    });
}