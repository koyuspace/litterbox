import $ from "jquery";

export function renderTimeline(selector, data) {
    $(selector).html("");
    data.forEach(element => {
        let status = "<div class=\"card bg-dark status\">";
        let display_name = element.account.display_name;
        status += `<p><b class="display-name" id="dp-${element.account.id}">${display_name}</b></p>`;
        status += element.content;
        status += "</div>";
        $(selector).append(status);
        if (element.account.emojis.length > 0) {
            element.account.emojis.forEach(dp_emoji => {
                $(`#dp-${element.account.id}`).html($(`#dp-${element.account.id}`).html().replaceAll(`:${dp_emoji.shortcode}:`, `<img src="${dp_emoji.url}" alt="Emoji ${dp_emoji.shortcode}" class="emoji">`));
            });
        }
    });
}